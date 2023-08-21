import path from 'path';
import fsp from 'fs/promises';
import cheerio from 'cheerio';

const getters = {
  dir: (normname) => `${normname}_files`,
  file: {
    png: (normname) => {
      const parts = normname.split('-');
      const part = parts.slice(0, parts.length - 1);
      return `${part.join('-')}.png`;
    },
    jpg: (normname) => {
      const parts = normname.split('-');
      const part = parts.slice(0, parts.length - 1);
      return `${part.join('-')}.jpg`;
    },
    html: (normname) => `${normname}.html`,
  },
};

const mapping = {
  dir: getters.dir,
  png: getters.file.png,
  html: getters.file.html,
};

const getImagePath = (readedHTML) => {
  const $ = cheerio.load(readedHTML);
  return $('img').attr('src');
};

const getReadingHTML = async (pathToHTML) => {
  try {
    const html = await fsp.readFile(pathToHTML, 'utf-8');
    return html;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getExt = (filepath) => {
  const result = path.extname(filepath);
  return result.slice(1);
};

const getNormname = (url, type) => {
  const withoutProtocol = url.split('://')[1];
  const filename = withoutProtocol.replace(/\W/g, '-');
  return mapping[type](filename);
};

const getFullPath = (userpath, filename) => path.join(userpath, filename);

export {
  getNormname,
  getFullPath,
  getImagePath,
  getReadingHTML,
  getExt,
};
