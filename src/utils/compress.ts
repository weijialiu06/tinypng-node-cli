import utils from './index';

export interface ICompressResult {
  compressedSource: string;
  size1: number;
  size2: number;
  compressSize: number;
  compressRatio: number;
}

const path = require('path');
const tinify = require('tinify');
const globby = require('globby');
const chalk = require('chalk');
const md5File = require('md5-file');
const ora = require('ora');

/**
 * 压缩目录下的图片
 * 
 * @param {string} directory 目标目录
 * @returns 
 */
async function compressDirectory(originDirectory: string, outputDirectory?: string): Promise<void> {
  const canUse = await utils.validateTinypng();
  if (canUse) {

    const imageFiles: string[] = globby.sync([
      `${originDirectory}/**/*.png`,
      `${originDirectory}/**/*.jpg`
    ]);
    const total = imageFiles.length;

    for (let i = 0; i < total; i++) {
      const image = imageFiles[i];
      const currentName = path.basename(image);
      const cacheFileName = utils.getFileNameInCache(image);
      if (cacheFileName) {
        console.log(chalk.green(`file ${currentName} has been compressed `) + chalk.yellow(`(${i + 1}/${total})`));
        const cacheFile = `${utils.getCacheDirectory()}/${cacheFileName}`;
        utils.copyFile(cacheFile, image); //  get a compress texture from the cached file;
        continue;
      }
      const loading = ora(`'start compressing...'`).start();
      loading.color = 'yellow';
      loading.text = chalk.yellow(`compressing ${currentName} (${i + 1}/${total})`);
      const info = await compressImage(image);
      utils.copyFile(info.compressedSource, image);
      loading.succeed();
      // loading.succeed(chalk.cyan(`compress ${currentName} succeed! saved ${info.compressSize}kb` + chalk.yellow(`(${i + 1}/${total})`)));
      loading.stop();
    }
  }
}

/**
 * 压缩单张图片
 * 
 * @param {string} iamgePath 
 * @returns {Promise<ICompressResult>} 
 */
async function compressImage(iamgePath: string): Promise<ICompressResult> {
  const targetCacheDirectory = utils.getCacheDirectory();
  return new Promise((resolve, reject) => {
    const md5Name = md5File.sync(iamgePath);
    const ext = path.extname(iamgePath);
    const targetCachePath = `${targetCacheDirectory}/${md5Name}${ext}`;
    tinify
      .fromFile(iamgePath)
      .toFile(targetCachePath)
      .then(() => {
        const size1 = utils.getImageSize(iamgePath);
        const size2 = utils.getImageSize(targetCachePath);
        const compressSize = ~~(size1 - size2).toFixed(2);
        resolve({
          compressedSource: targetCachePath,
          size1,
          size2,
          compressSize,
          compressRatio: ~~((compressSize / size1) * 100).toFixed(2)
        });
      })
      .catch((e: Error) => {
        console.error(e);
        reject(e);
      });
  });
}

export default compressDirectory;
