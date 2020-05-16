import { ICommandItem } from '../core/commands';

function commanderHandler(command: ICommandItem): void {
  command.action();
}

export default commanderHandler;
