import path from "path";
import fs from "fs";

const getData = (dirPath) => {
    const files = fs.readdirSync(dirPath);
    const data = {};
    for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const filePath = path.resolve(dirPath, file);
        const fileData = fs.readFileSync(filePath, "utf8");
        //if file empty, skip
        if (!fileData) continue;

        const fileName = path.basename(file, ".json").replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        data[fileName] = JSON.parse(fileData);
    }
    return data;
};

const getFilepaths = (baseDir, type) => {
  if (!type) return;
  let dir = path.resolve(baseDir, type);
  const files = fs.readdirSync(dir);
  const data = {};
  for (const file of files) {
      const filePath = path.relative(baseDir, path.resolve(dir, file));
      const fileName = path.basename(file, '.' + type).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      data[fileName] = filePath;
  }
  return data;
};


class getSassData {
    constructor(options) {
      this.canonicalize = this.canonicalize.bind(this);
      this.load = this.load.bind(this);

      this.dataDir = (options && options.dataDir) ? options.dataDir : '';

    }
    canonicalize(url) {
        if (!url.endsWith('.json')) return null;

        if (url.startsWith('https//') || url.startsWith('http://')) {
          return null
        }

        const dataDir = (url.startsWith('./')) ? '' : this.dataDir;
          
        const filePath = path.resolve(dataDir, url);

        if (!fs.existsSync(filePath)) return null;

        return new URL(`file://${filePath}`);
        
    }
    load(canonicalUrl) {

        let jsonString = fs.readFileSync(canonicalUrl, 'utf-8');

        // read the contents of the JSON file
        const jsonData = JSON.parse(jsonString);

        // convert the JSON data to SASS variables
        let sassVars = '';
        function parseJson(data, parentKey = '') {
            for (const key in data) {
              if (typeof data[key] === 'object') {
                parseJson(data[key], `${parentKey}${key}-`);
              } else {
                //if data[key] contains a colon, wrap it in quotes
                if (data[key].includes(':')) {
                  data[key] = `"${data[key]}"`;
                }
                sassVars += `$${parentKey}${key}: ${data[key]};\n`;
              }
            }
          }
          parseJson(jsonData);

        return {
            contents: sassVars,
            syntax: 'scss'
        }
    }
}




export { getData, getSassData, getFilepaths };
