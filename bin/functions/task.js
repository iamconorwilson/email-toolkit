import { resolve as _resolve } from 'path';
import { getFiles, readFromFile, writeFile, findCommonRoot } from '../functions/fileHelper.js';
import { log } from '../functions/logger.js';
import { displayError } from '../functions/errors.js';




const utils = {
    getFiles,
    readFromFile,
    writeFile,
    findCommonRoot,
    log
}


const task = (name, func, resolve) => {

    const start = process.hrtime.bigint();

    func(utils).then(() => {

    const end = process.hrtime.bigint();

    const time = Math.round((Number(end - start) / 1000000), 2);

    resolve(log(`Finished ${name} in ${time}ms`));
    }).catch((e) => {
        log(e, 'error');
        return;
    });
};



export { task };