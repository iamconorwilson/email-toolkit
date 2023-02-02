import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const services = [];

const init = async (options) => {

    //if data directory is not set, set it to the default
    if (!options.dir.data) {
        options.dir.data = join(options.dir.source, 'data');
    }

    //check if build directory exists, if not, create it
    if (!existsSync(options.dir.build)) {
        mkdirSync(options.dir.build);
    }

    //check if css directory exists, if not, create it
    if (!existsSync(join(options.dir.build, 'css'))) {
        mkdirSync(join(options.dir.build, 'css')); 
    }

    const files = readdirSync('./src/services');
    for await (const file of files) {
        if (file.endsWith('.js')) {
            const fileName = basename(file, '.js');
            const { default: Service } = await import(`../services/${file}`);
            const instance = new Service(options);
            if (instance.init) {
                let func = instance.init();
                services[fileName] = func;
            }
        }
    }

    return services;
}

export { init };