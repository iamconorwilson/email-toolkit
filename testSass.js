import sass from 'sass';
import fs from 'fs';
import path from 'path';

let dataDir = './test/src/data';

class getSassData {
  constructor(options) {
      this.dataDir = options.dataDir;
      console.log(this.dataDir);

      this.canonicalize = this.canonicalize.bind(this);
      this.load = this.load.bind(this);
  }
  canonicalize(url) {
      if (!url.endsWith('.json')) return null;

      const filePath = path.resolve(this.dataDir, url);

      console.log(filePath);

      // if (!fs.existsSync(filePath)) return null;

      return new URL(`file://${filePath}`);
      
  }
  load(canonicalUrl) {

      // read the contents of the JSON file
      const jsonString = fs.readFileSync(canonicalUrl, 'utf-8');
      const jsonData = JSON.parse(jsonString);

      //convert canonicalUrl to filepath
      const filePath = canonicalUrl.toString().replace('file://', '');
      const fileName = path.basename(filePath, '.json').replace(/-([a-z])/g, (g) => g[1].toUpperCase());


      // convert the JSON data to SASS variables
      let sassVars = '';
      function parseJson(data, parentKey = '') {
          for (const key in data) {
            if (typeof data[key] === 'object') {
              parseJson(data[key], `${parentKey}${key}-`);
            } else {
              sassVars += `$${parentKey}${key}: ${data[key]};\n`;
            }
          }
        }
        parseJson(jsonData, `${fileName}_`);

      return {
          contents: sassVars,
          syntax: 'scss'
      }
  }
}

// function jsonImporter(url, prev, done) {
//   // check if the file is a .json file
//   if (!url.endsWith('.json')) {
//     return null;
//   }

//   // read the contents of the JSON file
//   const jsonString = fs.readFileSync(url, 'utf-8');
//   const jsonData = JSON.parse(jsonString);

//   // convert the JSON data to SASS variables
//   let sassVars = '';
//   for (const key in jsonData) {
//     sassVars += `$${key}: ${jsonData[key]};\n`;
//   }

//   // return the SASS variables as the file content
//   done({
//     contents: sassVars
//   });
// }


let jsonImporter = new getSassData({dataDir: dataDir});


let compile = sass.compileString(`
    @import "data.json";
    h1 {
        color: $data_color;
        height: $data_size-height;
    };
    `,{
  importers: [jsonImporter]
})

console.log(compile.css.toString());