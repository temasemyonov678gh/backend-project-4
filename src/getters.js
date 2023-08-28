import path from 'path';
import fsp from 'fs/promises';
import cheerio from 'cheerio';

const rename = (normname, ext) => {
  const parts = normname.split('-');
  const part = parts.slice(0, parts.length - 1);
  return `${part.join('-')}.${ext}`;
};

const getters = {
  dir: (normname) => `${normname}_files`,
  file: {
    png: (normname) => rename(normname, 'png'),
    jpg: (normname) => rename(normname, 'jpg'),
    css: (normname) => rename(normname, 'css'),
    js: (normname) => rename(normname, 'js'),
    html: (normname) => `${normname}.html`,
  },
};

const mapping = {
  dir: getters.dir,
  png: getters.file.png,
  html: getters.file.html,
  jpg: getters.file.jpg,
  css: getters.file.css,
  js: getters.file.js,
};

const getReadingHTML = async (pathToHTML) => {
  try {
    const html = await fsp.readFile(pathToHTML, 'utf-8');
    return html;
  } catch (error) {
    console.error('Ошибка при попытке прочитать HTML-файл');
    throw new Error(error);
  }
};

const getExt = (filepath) => {
  const result = path.extname(filepath);
  return result.slice(1);
};

const getNormname = (url, type = undefined) => {
  const withoutProtocol = url.split('://')[1];
  let resultType = type ?? getExt(withoutProtocol);
  if (resultType.length === 0) {
    resultType = 'html';
  }
  const filename = withoutProtocol.replace(/\W/g, '-');
  return mapping[resultType](filename);
};

const getFullPath = (userpath, filename) => path.join(userpath, filename);

const getResourcesPathes = (html) => {
  const $ = cheerio.load(html);
  const hrefEl = [];
  const srcEl = [];

  $('link').each((i, el) => {
    hrefEl.push([$(el).attr('href'), i]);
  });

  $('script, img').each((i, el) => {
    srcEl.push([$(el).attr('src'), i]);
  });

  return { hrefEl, srcEl };
};

const getFilteredAndRenamedLinks = (originURL, links) => {
  const func = (arr) => arr
    .filter(([link]) => {
      const url = new URL(link, originURL);
      return url.origin === originURL;
    })
    .map(([link, i]) => {
      const newURL = new URL(link, originURL);
      return [newURL.href, i];
    });

  // создаем полные URL-пути и возвращем объект с новыми значениями
  const hrefEl = func(links.hrefEl);
  const srcEl = func(links.srcEl);
  return { hrefEl, srcEl };
};

const getNormNamesOfLinks = (links) => {
  const func = (arr) => arr.map(([link, i]) => [getNormname(link), i]);
  const hrefEl = func(links.hrefEl);
  const srcEl = func(links.srcEl);
  return { hrefEl, srcEl };
};

const getFilepathes = (links, dirpath) => {
  const func = (arr) => arr.map(([filename, i]) => [`${dirpath}/${filename}`, i]);
  const hrefEl = func(links.hrefEl);
  const srcEl = func(links.srcEl);
  return { hrefEl, srcEl };
};

export {
  getNormname,
  getFullPath,
  getReadingHTML,
  getExt,
  getResourcesPathes,
  getFilteredAndRenamedLinks,
  getNormNamesOfLinks,
  getFilepathes,
};
