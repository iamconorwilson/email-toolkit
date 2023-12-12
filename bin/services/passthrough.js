import { basename } from 'path';
import { copyFileSync, statSync, existsSync, mkdirSync } from 'fs';

import { task } from '../functions/task.js';

class Passthrough {
    constructor(context) {
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;
        this.passthrough = context?.passthrough || [];

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render }
    }

    async render() {
            if (this.passthrough.length === 0) {
                return
            }


            for (const passthrough of this.passthrough) {
                    const { src, dest } = passthrough;
                    await task('passthrough', async (utils) => {
                        let { getFiles, findCommonRoot } = utils;

                        let files = await getFiles(src);

                        let common = findCommonRoot(files);
                        
                        for (const file of files) {
                            if (statSync(file).isDirectory()) {
                                return;
                            }

                            let destFile = file.replace(common, dest);
                            let destDir = destFile.replace(basename(destFile), '');

                            if (!existsSync(destDir)) {
                                mkdirSync(destDir, { recursive: true });
                            }

                            copyFileSync(file, destFile);

                        };
                    });
            };
        };
}

export default Passthrough;