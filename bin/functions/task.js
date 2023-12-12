import { resolve as _resolve } from 'path';
import * as utils from '../functions/fileHelper.js';
import { displayError } from '../functions/errors.js';


const { log } = utils;

const task = async (name, func) => {
    const start = process.hrtime.bigint();
  
    try {
      await func(utils);
      const end = process.hrtime.bigint();
      const time = Math.round(Number(end - start) / 1000000, 2);
      log(`Finished ${name} in ${time}ms`);
    } catch (e) {
      log(`${name}: ${e}`, 'error');
      throw e; // Re-throw the error for higher-level error handling
    }
  };



export { task };