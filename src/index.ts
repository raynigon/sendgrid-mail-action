import * as core from '@actions/core';
import MailService from '@sendgrid/mail';
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import { EmailData } from "@sendgrid/helpers/classes/email-address";
import * as mime from "mime-types";
import fs from "fs";
import path from "path"

async function createAttachment(filepath: string) {
    const filename = path.parse(filepath).base
    let mimeType = mime.lookup(filename)
    if (!mimeType) {
        mimeType = "text/plain"
    }
    const buffer = await fs.promises.readFile(filepath)
    const base64 = buffer.toString('base64')
    return {
        content: base64,
        filename: filename,
        type: mimeType,
        disposition: 'attachment',
        content_id: filename,
    }
}

async function main() {
    // Input
    const inputToken = core.getInput('sendgrid-token');
    const inputTo = core.getInput('to');
    const inputFrom = core.getInput('from');
    const inputSubject = core.getInput('subject');
    const inputText = core.getInput('text');
    const inputHtml = core.getInput('html');
    const inputAttachments = core.getInput('attachments');

    if (inputToken === undefined) {
        throw new Error('Undefined token');
    }
    if (inputTo === undefined) {
        throw new Error('Undefined receivers');
    }
    if (inputText === "" && inputHtml === "") {
        throw new Error('Either Text or HTML is required');
    }

    MailService.setApiKey(inputToken);

    const receivers: EmailData[] = inputTo.split(",")
        .map((receiver: string) => receiver.replace("\n", "").replace("\r", "").replace("\t", "").trim());

    const attachments = await Promise.all(
        inputAttachments.split(",")
            .map((filename: string) => filename.trim())
            .filter((filename: string) => filename != "")
            .map(createAttachment)
    )

    const mailData = {
        to: receivers,
        from: inputFrom,
        subject: inputSubject,
        text: inputText !== "" ? inputText : undefined,
        html: inputHtml !== "" ? inputHtml : undefined,
        attachments: attachments,
    };

    MailService.sendMultiple(mailData as MailDataRequired)
}
main().catch((error) => {
    core.setFailed(error.message);
})