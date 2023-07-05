import { basename } from 'path';
import { copyFile, statSync, existsSync, mkdirSync } from 'fs';

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

    // render() {
    //     return new Promise((resolve) => {
    //         //for each object in this.passthrough array
    //         if (this.passthrough.length === 0) {
    //             resolve();
    //         }

    //         let promises = []

    //         this.passthrough.forEach((passthrough) => {
    //             const promise = new Promise((resolve) => {
    //                 const { src, dest } = passthrough;
    //                 task('passthrough', { src: src, dest: dest }, async (filePath, fileString) => {
    //                     //copy file to destination
    //                     copyFile(filePath, dest + '/' + basename(filePath), (err) => {
    //                         if (err) throw err;
    //                     });
    //                     return { write: false };
    //                 }, resolve);
    //             });
    //             promises.push(promise);
    //         });

    //         Promise.all(promises).then(() => {
    //             resolve();
    //         });
    //     });
    // }
    render() {
        return new Promise((resolve) => {
            if (this.passthrough.length === 0) {
                resolve();
            }

            let promises = []

            this.passthrough.forEach((passthrough) => {
                const promise = new Promise((resolve) => {
                    const { src, dest } = passthrough;
                    task('passthrough', async (utils) => {
                        let { getFiles, findCommonRoot } = utils;

                        let files = await getFiles(src);

                        let common = findCommonRoot(files);
                        
                        files.forEach(async (file) => {
                            if (statSync(file).isDirectory()) {
                                return;
                            }

                            let destFile = file.replace(common, dest);
                            let destDir = destFile.replace(basename(destFile), '');

                            if (!existsSync(destDir)) {
                                mkdirSync(destDir, { recursive: true });
                            }

                            copyFile(file, destFile, (err) => {
                                if (err) throw err;
                            });

                        });
                    }, resolve);
                });
                promises.push(promise);
            });

            Promise.all(promises).then(() => {
                resolve();
            });
        });



            // task('nunjucksRender', async (utils) => {
            //     let { getFiles, readFromFile, writeFile } = utils;

            //     let files = await getFiles(this.sourceDir + '/*.njk');
                
            //     files.forEach(async (file) => {
            //         let data = {css: getFilepaths(this.buildDir, 'css'), ...getData(this.dataDir)};
                    
            //         let fileName = basename(file, '.njk') + '.html';
                    
            //         let fileString = await readFromFile(file);
                    
            //         let string = this.env.renderString(fileString, data);
            //         await writeFile(this.buildDir, fileName, string);
            //     });
            // }, resolve);
    }
}

export default Passthrough;