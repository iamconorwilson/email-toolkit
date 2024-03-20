import express, { static as serveStatic } from 'express';
import serveIndex from 'serve-index';
import connectLiveReload from 'connect-livereload';
import chokidar from 'chokidar';
import { render } from 'serve-index-custom-directory'
import { serverLog, log, createLRServer } from './utils/functions.js';

//COMMAND
const command = (program) => {
    program
        .command('serve')
        .description('Serve files in the current directory')
        .option('-p, --port <port>', 'Port to use - number', 3000)
        .option('-q, --qrcode <qrcode>', 'Show QR code in server info - boolean', true)
        .action((options) => {
            run(options);
        });

}


//RUN FUNCTION
let portHunting = false;
let port;
let lrport = 35729;


const run = (options) => {

    const app = express();

    //if port null set to options.port
    if (!port) port = options.port;
    const qrcode = options.qrcode;

    const currentDir = process.cwd();

    app.use(connectLiveReload({ port: setlrport }));
    app.use(serveStatic(currentDir));
    app.use(serveIndex(currentDir, { template: render, icons: true }));

    chokidar.watch(process.cwd(), { ignoreInitial: true })
        .on('change', refresh)

    app.listen(port, () => {
        if (portHunting) log(`Using available port ${port}`, 'info');
        serverLog(port, qrcode);
        portHunting = false;
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            log(`Port ${port} is in use, trying another one...`);
            port++;
            portHunting = true;
            run({ port, qrcode });
        } else {
            console.log(err);
            process.exit(1);
        }
    })
}


const { refresh, setlrport } = createLRServer(lrport);

export default command;