import { ICommandItem } from "./commands";

export default class Clear implements ICommandItem {
  command = "clear";
  description = 'clear all cache of tinypng-node-cli';
  option = {};
  action() {
    console.log("cache clear");
  }
}