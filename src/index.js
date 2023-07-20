import { getFilename, getFullPath } from './getters.js';
import createFile from './fileCreater.js';
import { getResponse, getData } from './pageDownloader.js';

export default async (userpath, url) => {
  // console.log(userpath, url);
  const filename = getFilename(url);
  const path = getFullPath(userpath, filename);
  const page = await getResponse(url);
  const data = getData(page);
  await createFile(path, data);
  console.log(path);
};
