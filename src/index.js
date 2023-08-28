import debug from 'debug';

import {
  getNormname,
  getFullPath,
  getReadingHTML,
  getResourcesPathes,
  getFilteredAndRenamedLinks,
  getNormNamesOfLinks,
  getFilepathes,
} from './getters.js';

import {
  createFile,
  createDir,
  modifyHTML,
  createFiles,
} from './creater.js';

import {
  getResponse,
  getData,
  getResponsesOfLinks,
} from './pageDownloader.js';

const log = debug('page-loader');

export default async (userpath, link) => {
  log(`program starts. url: ${link}, path to download: ${userpath}`);
  const getName = (type) => getNormname(link, type);
  const getPath = (name) => getFullPath(userpath, name);

  const url = new URL(link);
  const originURL = url.origin;

  const htmlRes = await getResponse(url);
  const html = getData(htmlRes);
  const dirname = getName('dir');
  const dirpath = getPath(dirname);

  log('started directory creation');
  await createDir(dirpath);
  log('sucseccful directory creation');

  const HTMLname = getName('html');
  const HTMLpath = getPath(HTMLname);

  log('started HTML-file creation');
  await createFile(HTMLpath, html);
  log('sucseccful HTML-file creation');

  const readedHTML = await getReadingHTML(HTMLpath);

  const links = getResourcesPathes(readedHTML);
  const filteredLinks = getFilteredAndRenamedLinks(originURL, links);

  log('download files');
  const responsesOfLinks = await Promise.all(getResponsesOfLinks(filteredLinks));
  const namesOfLinks = getNormNamesOfLinks(filteredLinks);
  const arrFilepathes = getFilepathes(namesOfLinks, dirname);
  const { hrefEl, srcEl } = arrFilepathes;

  log(`creating download files in directory ${userpath}`);
  await Promise.all(createFiles(dirpath, Object.values(namesOfLinks).flat(), responsesOfLinks));

  log('modifing HTML-file');
  await modifyHTML(HTMLpath, hrefEl, srcEl);

  console.log(`${dirname}/${HTMLname}`);
};
