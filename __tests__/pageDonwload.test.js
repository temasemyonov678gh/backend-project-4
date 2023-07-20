import nock from 'nock';
import fsp from 'fs/promises';
import path from 'node:path';
import os from 'node:os';
import pageLoader from '../src/index.js';
import { getFilename } from '../src/getters.js';

nock.disableNetConnect();

let tempDir;
let expectedData;
const url = 'https://ru.hexlet.io';

beforeEach(async () => {
  tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('download page with nock', async () => {
  expectedData = 'this is data of page: https://ru.hexlet.io/courses';
  const filepath = path.join(tempDir, getFilename(`${url}/courses`));
  nock(url)
    .get('/courses')
    .reply(200, expectedData);

  await pageLoader(tempDir, `${url}/courses`);
  const expectData = await fsp.readFile(filepath, 'utf-8');
  expect(expectData).toEqual(expectedData);
});
