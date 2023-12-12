import * as sass from 'sass';
import { basename } from 'path';

import { task } from '../functions/task.js';
import { getSassData } from '../functions/getdata.js';
import { deepMerge } from '../functions/deepmerge.js';

class Sass {
    constructor(context) {
        this.sass = sass;
        this.buildDir = context.dir.dest;
        this.dataDir = context.dir.data;
        this.sourceDir = context.dir.src;

        this.sassOpts = context.sass?.customOpts;

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render }
    }
    async render() {
        await task('sass', async (utils) => {
            let { getFiles, writeFile } = utils;
        
            let files = await getFiles(this.sourceDir + '/sass/!(_*).scss');
            
            for (const file of files) {
                let outputStyle = 'expanded';
                let fileName = basename(file, '.scss') + '.css';
                const opts = this.sassOpts ?? { style: outputStyle, importers: [ new getSassData({ dataDir: this.dataDir }) ] };
        
                let string = this.sass.compile(file, opts).css;
                await writeFile(this.buildDir + '/css', fileName, string);
            }
        });
    }
}

export default Sass;