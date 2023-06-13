import path from 'path';
import fs from 'fs';

import { log } from './logger.js';


const displayError = (name, error, filePath) => {
    let l;
    let c;
    let message;

    if (name !== 'sassRender' && name !== 'nunjucksRender'){
        log(`Error rendering ${filePath} - ${error}`, 'error') 
        return;
    } 
    
    if (name === 'sassRender') {
        l = error.span.start.line;
        c = error.span.start.column;
        message = error.sassMessage;
    }

    if (name === 'nunjucksRender') {
        let njkMsg = error.message;
        let lineMatch = njkMsg.match(/Line (\d+)/);
        l = lineMatch[1];
        let columnMatch = njkMsg.match(/Column (\d+)/);
        c = columnMatch[1];
        //get message from end of string and capitalize first letter
        message = njkMsg.substring(njkMsg.lastIndexOf(']') + 4)
        message = message.charAt(0).toUpperCase() + message.slice(1);
    }

    //get the line from the file
    let file = fs.readFileSync(filePath, 'utf-8');
    let lines = file.split('\n');
    let errorLine = lines[l-1].replace(/(\r\n|\n|\r)/gm, '').replace(/\s\s+/g, ' ');

    // 

    log(`Error rendering ${filePath}`, 'error');
    log(`Line: ${l}, Column: ${c} | ${errorLine}`, 'error');
    log(message, 'error');

    
}

export { displayError };