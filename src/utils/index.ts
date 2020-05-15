import program from "../program";


const path: typeof import("path") = require('path');
const fs: typeof import("fs") = require('fs');
const inquirer = require('inquirer');
const md5File = require('md5-file');
const mkdirp = require('mkdirp');
const tinify = require('tinify');
const chalk = require('chalk');
const ora = require('ora');


/**
 * 图片缓存的目录
 * 
 * string
 */
function getCacheDirectory(): string {
  const baseDirectory = process.cwd();
  const cachePath = `${baseDirectory}/.iamgeOptimizerCache`;
  mkdirp.sync(cachePath);
  return cachePath;
}

/**
 * 获取图片大小
 * 
 * @param {string} imageFilePath 
 * @returns {number} 
 */
function getImageSize(imageFilePath: string): number {
  const stat = fs.statSync(imageFilePath);
  return Number((stat.size / 1000).toFixed(2));
}

/**
 * 用md5作为文件名存储文件
 *
 * @param {any} originFile
 * @param {any} compressedFile
 */
function cacheFileByMd5Name(originFile: string, compressedFile: string) {
  try {
    const fileExt = path.extname(originFile);
    const md5Name = md5File.sync(originFile); // 用源文件的内容来md5
    const newFilePath = `${getCacheDirectory()}/${md5Name}${fileExt}`;
    renameFile(compressedFile, newFilePath);
  } catch (e) {
    console.error('cacheFileByMd5Name error', e);
  }
}

/**
 * 为文件重新命名
 * 
 * @param {string} originFile 
 * @param {string} targetFile 
 */
function renameFile(originFile: string, targetFile: string) {
  fs.rename(originFile, targetFile, (err) => {
    if (err) {
      console.error('renameFile Error: ', err);
    }
  });
}

/**
 * 验证tinypng账号状态
 * 
 * @returns canUse: boolean
 */
async function validateTinypng(): Promise<boolean> {
  let canUse: boolean = true;
  const key = await getKey();
  tinify.key = key;
  const loading = ora("validating key of tinypng...");
  try {
    loading.start();
    await tinify.validate();
    canUse = true;
    loading.stop();
  } catch (e) {
    canUse = false;
    loading.stop();
    console.error(chalk.red(e.message));
  }

  return canUse;
}


const MAX_ENTER_TIMES: number = 5; // 最大空输入次数
let currentEnterTimes: number = 0;
/**
 * 获取tinypng key
 * 
 * @returns {string} 
 */
async function getKey(): Promise<string> {

  if (program.key) {
    return program.key;
  }
  return inquirer.prompt([
    {
      type: 'input',
      name: 'key',
      message: chalk.yellow('please enter the key of tinypng:'),
    }
  ]).then(async (answers: any) => {
    const { key } = answers;
    if (!key.trim()) {
      if (currentEnterTimes >= MAX_ENTER_TIMES) {
        process.exit();
      } else {
        currentEnterTimes++;
        return await getKey();
      }
    } else {
      return key;
    }
  })

}

/**
 *从缓存目录中取出图片
 *
 * @param {any} file
 * @returns
 */
function getFileNameInCache(file: string) {
  let cacheName = '';
  try {
    const md5Name = md5File.sync(file); // 如果file 不存在会报错；
    const ext = path.extname(file);

    const isCached = fs.existsSync(`${getCacheDirectory()}/${md5Name}${ext}`);
    if (isCached) {
      cacheName = md5Name + ext;
    }
  } catch (e) {
    console.error(chalk.red(e));
  }

  return cacheName;
}

/**
 * 移动某个文件到目标路径
 * 
 * @param {string} originFile 
 * @param {string} targetFile 
 */
function copyFile(originFile: string, targetFile: string) {
  fs.createReadStream(originFile).pipe(fs.createWriteStream(targetFile));
}

export default {
  getCacheDirectory,
  getKey,
  getImageSize,
  cacheFileByMd5Name,
  validateTinypng,
  getFileNameInCache,
  copyFile
}