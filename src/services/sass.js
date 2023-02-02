import sass from 'sass';
import { basename } from 'path';

import { task } from '../functions/task.js';
import { getSassData } from '../functions/getdata.js';

class Sass {
    constructor(context) {
        this.sass = sass;
        this.buildDir = context.dir.build;
        this.dataDir = context.dir.data;
        this.sourceDir = context.dir.source;

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render }
    }
    render() {
        // let jsonImporter = new getSassData({ dataDir: this.dataDir });
        return new Promise((resolve) => {
            task('sassRender', { src: this.sourceDir + '/sass/!(_*).scss', dest: this.buildDir + '/css' }, (filePath, fileString) => {
                let outputStyle = basename(filePath, '.scss') === 'inline' ? 'expanded' : 'compressed';
                let fileName = basename(filePath, '.scss') + '.css';
                let string = this.sass.compile(filePath, 
                    { 
                        style: outputStyle,
                        importers: [ new getSassData({ dataDir: this.dataDir }) ]
                    }).css;
                return { fileName: fileName, string: string };
            }, resolve);
        });
    }
}

export default Sass;