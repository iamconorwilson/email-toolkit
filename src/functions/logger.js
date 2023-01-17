const chalk = require('chalk');

const colors = {
    error: chalk.red,
    warn: chalk.yellow,
    info: chalk.blue,
    success: chalk.green,
};

const log = (message, type) => {
    let time = new Date().toLocaleTimeString();
    // if type and type is in colors
    if (type && type in colors) {
        console.log(`[${time}] ${colors[type](type)}: ${message}`);
        return;
    } else {
        console.log(`[${chalk.green(time)}] ${message}`);
        return;
    }
}

exports.log = log;