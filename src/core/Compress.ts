import { ICommandItem } from './commands';
import program from '../program';
import compressDirectory from '../utils/compress';

const path = require('path');
const fs: typeof import('fs') = require('fs');
const chalk = require('chalk');

export default class Compress implements ICommandItem {
  public command = 'compress';
  public description = 'start compressing a directory images';
  public option = {
    isDefault: true
  };
  public action(): void {
    const targetDirectory = program.directory;
    if (!targetDirectory) {
      console.log(chalk.red("error= required option '-d, --directory <Directory>' not specified"));
      return;
    } else {
      const origin = path.resolve(process.cwd(), targetDirectory);
      if (!fs.existsSync(origin)) {
        console.log(chalk.red(`error= directory ${origin} does not exist`));
        return;
      }
      compressDirectory(origin);
    }
  }
}
