import { readdir, unlink } from "fs";
import { join } from "path";


const removeFiles = (dir) => {
    readdir(dir, (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          unlink(join(dir, file), (err) => {
            if (err) throw err;
          });
        }
      });
}

export { removeFiles };