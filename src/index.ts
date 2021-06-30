import * as core from '@actions/core';
import MailService from '@sendgrid/mail';
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import { EmailData } from "@sendgrid/helpers/classes/email-address";

async function main() {
    // Input
    const inputToken = core.getInput('sendgrid-token');
    const inputTo = core.getInput('to');
    const inputFrom = core.getInput('from');
    const inputSubject = core.getInput('subject');
    const inputText = core.getInput('text');
    const inputHtml = core.getInput('html');

    if (inputToken === undefined) {
        throw new Error('Undefined token');
    }
    if (inputTo === undefined) {
        throw new Error('Undefined receivers');
    }
    if (inputText === "" && inputHtml === ""){
        throw new Error('Either Text or HTML is required');
    }

    MailService.setApiKey(inputToken);

    const receivers: EmailData[] = inputTo.split(",")
        .map(receiver => receiver.replace("\n", "").replace("\r", "").replace("\t", "").trim());

    const mailData = {
        to: receivers,
        from: inputFrom,
        subject: inputSubject,
        text: inputText !== "" ? inputText : undefined,
        html: inputHtml !== "" ? inputHtml : undefined,
    };

    MailService.sendMultiple(mailData as MailDataRequired)
}
main().catch((error) => {
    core.setFailed(error.message);
})