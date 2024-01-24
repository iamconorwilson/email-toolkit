import { statSync, unlink, rmdirSync } from "fs";
import { join } from "path";
import glob from "glob";


const removeFiles = async (dir) => {

    let dirArray = [];

    await glob(dir, async (err, files) => {
        if (err) throw err;

        // Wait for all files to be processed
        await Promise.all(files.map(async (file) => {
            //if file is a directory
            if (statSync(file).isDirectory()) {
                //add to directory array to remove later
                dirArray.push(file);
            } else {
                //remove file
                return new Promise((resolve, reject) => {
                    unlink(file, (err) => {
                        if (err) reject(err);
                        resolve();
                    });
                });
            }
        }));

        // Wait for all directories to be removed
        await Promise.all(dirArray.map(async (dir) => {
            return new Promise((resolve, reject) => {
                rmdirSync(dir, {}, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        }));
    });

}

export { removeFiles };