# Email Pipeline
A suite of command line tools tailored for email development

## Installation
* Clone repository to a local folder and run `npm i -g`

## Commands
### config
Syntax: `emlpipe config`

Allows for updating the credentials used to send test emails.

### send
Syntax: `emlpipe send`

Send tests of HTML emails from the command line, using SMTP credentials set up using the config command.

### serve
Syntax: `emlpipe serve`

Options:
* `-p, --port <number>`: Port to use (default: 3000)
* `-q, --qrcode <boolean>`: Show a QR code in server info (default: true)

Run local development server to preview emails. Also allows for a QR code to be displayed in the terminal for easier previews on a mobile device (must be connected to the same network as host PC).
