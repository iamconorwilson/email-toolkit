import express, { static as serveStatic } from 'express';
import serveIndex from 'serve-index';
import connectLiveReload from 'connect-livereload';
import ip from 'ip';
import chalk from 'chalk';
const { address } = ip;

import { log } from '../functions/logger.js';

const app = express();

class Express {
    constructor(context) {
        this.express = express;
        this.buildDir = context.dir.build;
        this.sourceDir = context.dir.source;
        this.port = context.express?.port || 3000;
        this.customMiddleware = context.express?.middleware || [];

        this.init = this.init.bind(this);
    }

    init() {
        app.use(connectLiveReload({port: 35729}));
        app.use(serveStatic(this.buildDir));
        app.use(serveIndex(this.buildDir, {template: './src/server/index.html', stylesheet: './src/server/css/main.css', icons: true}));

        if (this.customMiddleware.length > 0) {
            this.customMiddleware.forEach((middleware) => {
                app.use(middleware);
            })
        }

        //if port in use, increment port number


        app.listen(this.port, () => {
            serverLog(this.port);
        })

        return app;
    }
} 


const serverLog = (port) => {
    let local = `http://localhost:${port}`;
    let ext = `http://${address()}:${port}`;

    console.log(
`[${chalk.green('Server')}] ${chalk.bold('Development server started')}
------------------------------------
${chalk.blue('Local')}: ${local}
${chalk.blue('Network')}: ${ext}
------------------------------------`
)


}


export default Express;