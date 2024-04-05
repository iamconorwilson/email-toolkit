#!/usr/bin/env node

import { log } from './functions/logger.js';
import { init } from './functions/init.js';
import { debounce } from './functions/debounce.js';
import { removeFiles } from './functions/removefiles.js';
import { setOpts } from './functions/setOpts.js';



let options = await setOpts();

let state = await init(options);

let watch = state.watch;
let reload = state.livereload;

const run = async () => {

    log('Running build...');
    
    try {
        await state.sass.render();
        await state.postcss.render();
        await state.passthrough.render();
        await state.nunjucks.render();
        await state.inlinecss.render();
        await state.cleanhtml.render();
        reload.refresh('*');
        log('Build complete.', 'success');
    } catch (error) {
        log(error, 'error');
        process.exit(1);
    }


    
}

//remove all files in build directory on first run
// await removeFiles(options.dir.dest + '/**/*');

const debouncedRun = debounce(run, 500);

watch.on('add', debouncedRun).on('change', debouncedRun)

await run();


