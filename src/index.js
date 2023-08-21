import {
  getNormname,
  getFullPath,
  getImagePath,
  getReadingHTML,
  getExt,
} from './getters.js';
import { createFile, createDir, modifyHTML } from './creater.js';
import { getResponseHTML, getData, getResponseImg } from './pageDownloader.js';

export default async (userpath, url) => {
  const getName = (type) => getNormname(url, type);
  const getPath = (name) => getFullPath(userpath, name);

  const HTMLfilename = getName('html');
  const dirname = getName('dir');
  const HTMLpath = getPath(HTMLfilename);
  const dirpath = getPath(dirname);

  const page = await getResponseHTML(url);
  const data = getData(page);
  await createFile(HTMLpath, data);
  await createDir(dirpath);

  const makeURL = new URL(url);
  const originURL = makeURL.origin;

  const readedHTML = await getReadingHTML(HTMLpath);
  const imgPath = getImagePath(readedHTML);
  const imgName = getNormname(`${originURL}${imgPath}`, getExt(imgPath));
  const imgInDirPath = getFullPath(dirpath, imgName);

  const pngResponse = await getResponseImg(`${originURL}${imgPath}`);
  const pngData = getData(pngResponse);
  await createFile(imgInDirPath, pngData);

  await modifyHTML(HTMLpath, `${dirname}/${imgName}`, 'img');

  console.log(HTMLfilename);
};
