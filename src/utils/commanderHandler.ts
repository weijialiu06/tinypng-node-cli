import { ICommandItem } from '../core/commands';


function commanderHandler(command: ICommandItem) {
  command.action();
};

export default commanderHandler;
