import fsp from 'fs/promises';

export default async (filepath, data) => {
  fsp.writeFile(filepath, data, 'utf-8');
};
