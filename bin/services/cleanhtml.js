import { comb, defaults } from 'email-comb';
import { basename } from 'path';
import prettier from 'prettier';

import { task } from '../functions/task.js';
import { deepMerge } from '../functions/deepmerge.js';


//add default whitelist with [data-ogsb] and [data-ogsc] attributes
let defaultOpts = {
    whitelist: defaults.whitelist.concat(['[data-ogsb]*', '[data-ogsc]*', '.content*']),
    removeHTMLComments: false
}

class CleanHtml {
    constructor(context) {
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;
        this.combOpts = deepMerge(defaultOpts, context.cleanHtml?.customOpts);
        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render }
    }

    async render() {
        await task('cleanHtml', async (utils) => {
            let { getFiles, readFromFile, writeFile, log } = utils;
        
            let files = await getFiles(this.buildDir + '/*.html');
        
            for (const file of files) {
                let fileString = await readFromFile(file);
                fileString = Buffer.from(fileString).toString('utf8');
                let fileName = basename(file);

                //remove <tbody> tags
                fileString = await fileString.replace(/<tbody>/g, '');
                fileString = await fileString.replace(/<\/tbody>/g, '');
        
                // Apply comb
                let combResult = comb(fileString, this.combOpts);

                log(`Cleaned ${fileName} removing ${combResult.deletedFromHead.length} from head and ${combResult.deletedFromBody.length} from body.`)

                let combString = combResult.result;


                // Then apply prettify
                let formattedString = await prettier.format(combString, { parser: 'html', printWidth: 900, htmlWhitespaceSensitivity: 'ignore', singleQuote: true });
        
                await writeFile(this.buildDir, fileName, formattedString);
            }
        });
    }
}

export default CleanHtml;