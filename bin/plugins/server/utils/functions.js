import { createServer } from "livereload";
import ip from 'ip';
import chalk from 'chalk';
import qrcode from 'qrcode-terminal';
import ora from 'ora';
const { address } = ip;


//log server info to console
const serverLog = (port, qr) => {
    let local = `http://localhost:${port}`;
    let ext = `http://${address()}:${port}`;

    console.log(
        `[${chalk.magentaBright('email-toolkit')}] ${chalk.bold('Development server started')}
------------------------------------
${chalk.blue('Local')}: ${local}
${chalk.blue('Network')}: ${ext}
------------------------------------`
    )

    if (qr === true) {
        qrcode.generate(ext, { small: true }, (qrcode) => {
            console.log(qrcode);
        })
    }
    console.log(`[${chalk.magentaBright('email-toolkit')}] Watching files...`);
}

//generic log function
const log = (msg) => {
    console.log(`[${chalk.magentaBright('email-toolkit')}] ${msg}`);
}

//debounce
const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    }
}

//create livereload server and refresh function
const createLRServer = (lrport) => {
    const lrserver = createServer({ port: lrport }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            lrport++;
            createLRServer(lrport);
        } else {
            console.log(err, 'error');
            process.exit(1);
        }
    }
    );
    const rfrsh = () => {
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine();
        const spinner = ora(`[${chalk.magentaBright('email-toolkit')}] Refreshing files...`).start();
        lrserver.refresh('*')
        setTimeout(() => {
            spinner.succeed(`[${chalk.magentaBright('email-toolkit')}] ${chalk.bold('Files refreshed')}`);
        }, 500);
    }

    const refresh = debounce(rfrsh, 500);
    return { refresh, lrport };
}

export { serverLog, log, createLRServer, debounce }