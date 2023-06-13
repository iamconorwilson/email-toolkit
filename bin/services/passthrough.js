import { basename } from 'path';
import { copyFile } from 'fs';

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

    render() {
        return new Promise((resolve) => {
            //for each object in this.passthrough array
            if (this.passthrough.length === 0) {
                resolve();
            }

            let promises = []

            this.passthrough.forEach((passthrough) => {
                const promise = new Promise((resolve) => {
                    const { src, dest } = passthrough;
                    task('passthrough', { src: src, dest: dest }, async (filePath, fileString) => {
                        //copy file to destination
                        copyFile(filePath, dest + '/' + basename(filePath), (err) => {
                            if (err) throw err;
                        });
                        return { write: false };
                    }, resolve);
                });
                promises.push(promise);
            });

            Promise.all(promises).then(() => {
                resolve();
            });
        });
    }
}

export default Passthrough;