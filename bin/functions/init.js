import { existsSync, mkdirSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname, basename } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const services = [];

const init = async (options) => {

    //if data directory is not set, set it to the default
    if (!options.dir.data) {
        options.dir.data = join(options.dir.src, 'data');
    }

    //check if build directory exists, if not, create it
    if (!existsSync(options.dir.dest)) {
        mkdirSync(options.dir.dest);
    }

    //check if css directory exists, if not, create it
    if (!existsSync(join(options.dir.dest, 'css'))) {
        mkdirSync(join(options.dir.dest, 'css')); 
    }

    const files = readdirSync(join( __dirname, '../services'));
    for await (const file of files) {
        if (file.endsWith('.js')) {
            const fileName = basename(file, '.js');
            const { default: Service } = await import(join(__dirname, `../services/${file}`));
            const instance = new Service(options, services);
            if (instance.init) {
                let func = instance.init();
                services[fileName] = func;
            }
        }
    }

    return services;
}

export { init };