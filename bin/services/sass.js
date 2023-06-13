import * as sass from 'sass';
import { basename } from 'path';
import { fs } from fs;

import { task } from '../functions/task.js';
import { getSassData } from '../functions/getdata.js';
import { removeFiles } from '../functions/removefiles.js';
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
    render() {
        // let jsonImporter = new getSassData({ dataDir: this.dataDir });
        return new Promise((resolve) => {
            removeFiles(this.buildDir + '/css');
            task('sassRender', { src: this.sourceDir + '/sass/!(_*).scss', dest: this.buildDir + '/css' }, (filePath, fileString) => {
                let outputStyle = basename(filePath, '.scss') === 'inline' ? 'expanded' : 'compressed';
                let fileName = basename(filePath, '.scss') + '.css';

                const opts = this.sassOpts ?? { style: outputStyle, importers: [ new getSassData({ dataDir: this.dataDir }) ] };

                let string = this.sass.compile(filePath, opts).css;
                return { fileName: fileName, string: string };
            }, resolve);
        });
    }
}

export default Sass;