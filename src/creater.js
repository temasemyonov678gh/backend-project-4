import fsp from 'fs/promises';
import cheerio from 'cheerio';

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

const modifyHTML = async (HTMLfilepath, inputFilepath, type) => {
  try {
    const html = await fsp.readFile(HTMLfilepath, 'utf-8');
    const $ = cheerio.load(html);
    $(type).attr('src', inputFilepath);
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
  modifyHTML,
};
