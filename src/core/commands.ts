import Compress from './Compress';
import Clear from './Clear';

export interface ICommandItem {
  command: string;
  description: string;
  alias?: string;
  option: object;
  action: Function;
}

export interface ICommand {
  [commandName: string]: ICommandItem;
}

const commands: ICommand = {
  'compress': new Compress(),
  'clear': new Clear()
};

export default commands;
