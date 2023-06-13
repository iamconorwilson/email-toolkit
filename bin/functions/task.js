import { resolve as _resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import glob from 'glob';
import { log } from '../functions/logger.js';
import { displayError } from '../functions/errors.js';


const task = (name, paths, func, resolve) => {
    const { src , dest } = paths;

    const start = process.hrtime.bigint();

    glob(src, async (err, files) => {

        let complete = 0;

        for (const file in files) {
            let filePath = _resolve(files[file]);
            let fileString = readFileSync(filePath);
            let rendered;
            try {
                rendered = await func(filePath, fileString);
            } catch (e) {
                // displayError(name, e, filePath);
                log(`Error rendering ${filePath}`, 'error');
                log(e, 'error');
                return;
            }

            if (rendered.write === false) {
                complete++;
                continue;
            }
            let { fileName, string } = rendered;

            writeFileSync(`${dest}/${fileName}`, string);
            complete++;
        }
        if (complete === files.length) {
            const end = process.hrtime.bigint();

            const time = Math.round((Number(end - start) / 1000000), 2);

            resolve(log(`Finished ${name} in ${time}ms`));
        }
    });
}

export { task };