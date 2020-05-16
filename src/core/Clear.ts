import { ICommandItem } from './commands';

export default class Clear implements ICommandItem {
  public command = 'clear';
  public description = 'clear all cache of tinypng-node-cli';
  public option = {};
  public action(): void {
    console.log('cache clear');
  }
}
