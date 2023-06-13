import express, { static as serveStatic } from 'express';
import serveIndex from 'serve-index';
import connectLiveReload from 'connect-livereload';
import ip from 'ip';
import chalk from 'chalk';
import { render } from 'serve-index-custom-directory'
import qrcode from 'qrcode-terminal';
const { address } = ip;


import { log } from '../functions/logger.js';

const app = express();

class Express {
    constructor(context) {
        this.express = express;
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;
        this.port = context.server?.port ?? 3030;
        this.qrcode = context.server?.qrCode ?? true;
        this.customMiddleware = context.server?.middleware ?? [];

        this.portHunting = false;

        this.init = this.init.bind(this);
    }

    init() {
        app.use(connectLiveReload({port: 35729}));
        app.use(serveStatic(this.buildDir));
        app.use(serveIndex(this.buildDir, {template: render, icons: true}));

        if (this.customMiddleware.length > 0) {
            this.customMiddleware.forEach((middleware) => {
                app.use(middleware);
            })
        }

        //if port in use, log to console and increment port number


        app.listen(this.port, () => {
            if (this.portHunting) log(`Using available port ${this.port}`, 'info');
            serverLog(this.port, this.qrcode);
            this.portHunting = false;
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                if (!this.portHunting) log(`Port ${this.port} is in use. Finding next available port...`, 'warn');
                this.port++;
                this.portHunting = true;
                this.init();
            } else {
                log(err, 'error');
                process.exit(1);
            }
        })

        app.port = this.port;

        return app;
    }
} 


const serverLog = (port, qr) => {
    let local = `http://localhost:${port}`;
    let ext = `http://${address()}:${port}`;

    console.log(
`[${chalk.green('Server')}] ${chalk.bold('Development server started')}
------------------------------------
${chalk.blue('Local')}: ${local}
${chalk.blue('Network')}: ${ext}
------------------------------------`
)

if (qr) {
    qrcode.generate(ext, {small: true}, (qrcode) => {
            console.log(qrcode);
        })
    }
}


export default Express;