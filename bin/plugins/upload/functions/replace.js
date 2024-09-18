
import * as cheerio from "cheerio";

// Function: htmlReplace
// Replaces all local paths in the HTML with absolute paths according to the config file and return a unique list of images to be uploaded.
const htmlReplace = (html, publicUrl) => {
    const $ = cheerio.load(html);

    const images = [];

    $('img').each((i, elem) => {
        const src = $(elem).attr('src');

        if (src.startsWith('http')) {
            return;
        }

        if (!images.includes(src)) {
            images.push(src);
        }

        $(elem).attr('src', `${publicUrl}/${src}`);
    });

    return { html: $.html(), images: images };
}

// Function: cssReplace
// Replaces all local paths in the embedded CSS within a HTML document, with absolute paths according to the config file and return a unique list of images to be uploaded.
const cssReplace = (html, publicUrl) => {
    const $ = cheerio.load(html);

    const images = [];

    $('style').each((i, elem) => {
        let style = $(elem).html();

        const regex = /url\(["']?([^"')]+)["']?\)/g;
        let match;

        while ((match = regex.exec(style)) !== null) {
            let src = match[1];

            if (src.startsWith('http')) {
                continue;
            }

            if (!images.includes(src)) {
                images.push(src);
            }

            // Construct the new URL
            const newUrl = `${publicUrl}${src.startsWith('/') ? src.slice(1) : src}`;
            style = style.replace(match[0], `url("${newUrl}")`);
        }

        $(elem).html(style);
    });
    
    return { html: $.html(), images: images };
}

export { htmlReplace, cssReplace }