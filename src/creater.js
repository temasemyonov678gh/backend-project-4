import fsp from 'fs/promises';
import path from 'path';
import cheerio from 'cheerio';
import { getData } from './pageDownloader';

const createFile = async (filepath, data) => {
  try {
    fsp.writeFile(filepath, data, 'utf-8');
  } catch (error) {
    console.error('Ошибка при создании файла');
    throw new Error(error);
  }
};

const createDir = async (dirpath) => {
  try {
    fsp.mkdir(dirpath, { recursive: true });
  } catch (error) {
    console.error('Ошибка при создании директории');
    throw new Error(error);
  }
};

const createFiles = (dirpath, arrFilenames, arrResponses) => arrFilenames
  .map(([filename], index) => {
    const normFilepath = path.join(dirpath, filename);
    const data = getData(arrResponses[index]);
    return createFile(normFilepath, data);
  });

const modifyHTML = async (HTMLfilepath, hrefEl, srcEl) => {
  try {
    const html = await fsp.readFile(HTMLfilepath, 'utf-8');
    const $ = cheerio.load(html);
    hrefEl.map(([filepath, i]) => $('link').eq(i).attr('href', filepath));
    srcEl.map(([filepath, i]) => $('script, img').eq(i).attr('src', filepath));
    const modifedHTML = $.html();
    fsp.writeFile(HTMLfilepath, modifedHTML, 'utf-8');
  } catch (error) {
    console.error('Ошибка при изменении HTML-файла');
    throw new Error(error);
  }
};

export {
  createFile,
  createDir,
  createFiles,
  modifyHTML,
};
