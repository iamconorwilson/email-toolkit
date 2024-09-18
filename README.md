# Email Toolkit
A suite of command line tools tailored for email development

## Installation
* Clone repository to a local folder and run `npm i -g`
* Run the config file to create a the `email-pipline.config.json` file in the user directory

## Commands
### config
Syntax: `emltool config`

Creates `email-toolkit.config.json` config file in the user directory.

### send
Syntax: `emltool send`

Send tests of HTML emails from the command line, using SMTP credentials set up using the config command.

### serve
Syntax: `emltool serve`

Options:
* `-p, --port <number>`: Port to use (default: 3000)
* `-q, --qrcode <boolean>`: Show a QR code in server info (default: true)

Run local development server to preview emails. Also allows for a QR code to be displayed in the terminal for easier previews on a mobile device (must be connected to the same network as host PC).

### upload
Syntax: `emltool upload`

Select a local HTML file and specify a path on the remote server, and the file will be uploaded along with all locally hosted images. Image src URLs will also be replaced with the new remote URL.
