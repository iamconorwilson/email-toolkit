import { statSync, unlink, rmdirSync } from "fs";
import { join } from "path";
import glob from "glob";


const removeFiles = (dir) => {

    glob(dir, async (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
            
            //if file is a directory
            if (statSync(file).isDirectory()) {
                //skip if directory is css
                if (file.endsWith('css')) {
                    return;
                }

                //remove all files in directory
                removeFiles(join(file, '*'));

                //remove directory
                rmdirSync(file);

                return;
            }

            //remove file
            unlink(file, (err) => {
                if (err) throw err;
            });

        });
    });

}

export { removeFiles };