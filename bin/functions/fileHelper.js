import { mkdir, readFile, writeFileSync } from 'fs';
import { dirname } from 'path';
import glob from 'glob';


const getFiles = (src) => {
    return new Promise((resolve, reject) => {
        glob(src, (err, files) => {
            if (err) {
                reject(err);
            }
            resolve(files);
        });
    });
}

const readFromFile = (path) => {
    return new Promise((resolve, reject) => {
        readFile(path, (err, data) => {
            if (err) {
                reject(err);
            }
            //data is a buffer, convert to string
            data = data.toString();
            resolve(data);
        });
    });
}

const writeFile = (path, fileName, data) => {
    return new Promise((resolve, reject) => {
        mkdir(path, { recursive: true }, (err) => {
            if (err) {
                reject(err);
            }
            writeFileSync(`${path}/${fileName}`, data);
            resolve();
        });
    });
}

const findCommonRoot = (paths) => {
    let common = dirname(paths[0]);

    paths.forEach((path) => {
        let current = dirname(path);

        while (!current.startsWith(common)) {
            common = dirname(common);
        }
    });

    return common;
}




export { getFiles, readFromFile, writeFile, findCommonRoot };