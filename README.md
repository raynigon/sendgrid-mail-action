# SendGrid Mail Action

This actions send a mail using the SendGrid API to the defined mails

## Inputs

### `sendgrid-token`

**Required** The token of the SendGrid that will be used.

### `to`

**Required** The receivers ( can be only one ) that the email will go, seperated by the comma (,) character. For example
```
  to: a.mail@mail.to,b.mail@mail.to
``` 
where "," can be anything as it can be defined at the splitterator.

### `from`

**Optional** The mail that will be shown as the sender. Default : "sendgridmailaction@github.com"

### `subject`

**Optional** The subject of the mail. Default: GitHub action notification

### `text`

**Optional** The content of the mail as plain text.

### `html`

**Optional** The content of the mail as HTML Document.

### `attachments`

**Optional** A comma seperated list of files which should be attached to the e-mail. 
Mime Types will be calculated from the file extension. If no mime type was found `text/plain` is assumed.

## Example usage
```
- name: SendGrid Action
  uses: raynigon/sendgrid-mail-action@v1.0.2
  with:
    sendgrid-token: 'sample'
    to: 'a.mail@mail.to'
    text: 'hello world!'
```
