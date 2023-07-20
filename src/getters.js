import path from 'path';

const getFilename = (url) => {
  const withoutProtocol = url.split('://')[1];
  const filename = withoutProtocol.replace(/\W/g, '-');
  return `${filename}.html`;
};

const getFullPath = (userpath, filename) => path.join(userpath, filename);

export {
  getFilename,
  getFullPath,
};
