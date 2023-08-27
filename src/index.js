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

export default async (userpath, link) => {
  const getName = (type) => getNormname(link, type);
  const getPath = (name) => getFullPath(userpath, name);

  const url = new URL(link);
  const originURL = url.origin;

  const htmlRes = await getResponse(url);
  const html = getData(htmlRes);
  const dirname = getName('dir');
  const dirpath = getPath(dirname);
  await createDir(dirpath);
  const HTMLname = getName('html');
  const HTMLpath = getPath(HTMLname);
  await createFile(HTMLpath, html);
  const readedHTML = await getReadingHTML(HTMLpath);

  const links = getResourcesPathes(readedHTML);
  const filteredLinks = getFilteredAndRenamedLinks(originURL, links);
  const responsesOfLinks = await Promise.all(getResponsesOfLinks(filteredLinks));
  const namesOfLinks = getNormNamesOfLinks(filteredLinks);
  const arrFilepathes = getFilepathes(namesOfLinks, dirname);
  const { hrefEl, srcEl } = arrFilepathes;
  await Promise.all(createFiles(dirpath, Object.values(namesOfLinks).flat(), responsesOfLinks));

  await modifyHTML(HTMLpath, hrefEl, srcEl);

  console.log(`${dirname}/${HTMLname}`);
};
