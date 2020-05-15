import program from './program';
import commanderHandler from './utils/commanderHandler';
import commands from './core/commands';
const version = require("../package.json").version;


program
  .version(version, '-V, --version', 'current version of tinypng-node-cli')
  .option('-d, --directory <Directory>', 'target directory')
  .option('-D, --directory <Directory>', 'the cache directory of tinypng-node-cli')
  .option('-k, --key <string>', 'the key of tinypng')
  .parse(process.argv);

// regist commands
Object.keys(commands)
  .forEach(command => {
    const conf = commands[command];
    program
      .command(conf.command, null, { ...conf.option })
      .description(conf.description)
      .action(function () {
        commanderHandler(commands[command]);
      });
  });

program.parse(process.argv);

export { };
