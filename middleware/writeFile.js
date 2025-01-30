import { writeFile } from 'fs/promises';
import * as path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const writeDataToFile = async (filename, content) => {
    try {
        console.log(filename)
        console.log(process.cwd());
        console.log(path.join(__dirname, filename)) // check if the path is correct
        await writeFile(path.join(__dirname, filename), JSON.stringify(content));      
     return 'File Updated';
      } catch (err) {
        console.error(err);
      }
}