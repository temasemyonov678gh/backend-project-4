import fsp from 'fs/promises';
import path from 'node:path';
import os from 'node:os';
import nock from 'nock';
import pageLoader from '../src/index.js';
import { getNormname } from '../src/getters.js';

nock.disableNetConnect();

let tempDir;

let HTMLfilepath;
let dirpath;
let PNGfilepath;

let expectedBeforeHTML;
let expectedAfterHTML;
let expectedPNG;

let receivedHTML;

const url = 'https://ru.hexlet.io';
const PNGurl = 'https://ru.hexlet.io/assets/professions/nodejs.png';

beforeAll(async () => {
  // создание временной директории
  tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));

  // создание путей файлов во временной директории
  const createpath = (link, type) => path.join(tempDir, getNormname(link, type));
  HTMLfilepath = createpath(`${url}/courses`, 'html');
  dirpath = createpath(`${url}/courses`, 'dir');
  PNGfilepath = path.join(dirpath, getNormname(PNGurl));

  // ожидаемые файлы после работы программы
  const readFile = async (filepath) => fsp.readFile(filepath, 'utf-8');
  expectedBeforeHTML = await readFile('./__fixtures__/ru-hexlet-io-courses.html');
  expectedAfterHTML = await readFile('./__fixtures__/after.html');
  expectedPNG = await readFile('./__fixtures__/nodejs.png');

  nock(url)
    .persist()
    .get('/courses')
    .reply(200, expectedBeforeHTML);

  nock(url)
    .persist()
    .get('/assets/professions/nodejs.png')
    .reply(200, expectedPNG);

  nock(url)
    .persist()
    .get('/assets/application.css')
    .reply(200, 'application.css');

  nock(url)
    .persist()
    .get('/packs/js/runtime.js')
    .reply(200, 'runtime.js');

  await pageLoader(tempDir, `${url}/courses`);

  // полученные файлы
  receivedHTML = await fsp.readFile(HTMLfilepath, 'utf-8');
});

describe('test page-loader program', () => {
  test('html modyfied', () => {
    expect(receivedHTML).toEqual(expectedAfterHTML);
  });

  test('folder create', async () => {
    const result = await fsp.lstat(dirpath);
    expect(result.isDirectory()).toBeTruthy();
  });

  test('folder name is right', async () => {
    const resultpath = path.join(tempDir, 'ru-hexlet-io-courses_files');
    const result = await fsp.lstat(resultpath);
    expect(result.isDirectory()).toBeTruthy();
  });

  test('img file create', () => {
    expect(path.extname(PNGfilepath)).toEqual('.png');
  });

  test('img is correct', async () => {
    const receivedPNG = await fsp.readFile(PNGfilepath, 'utf-8');
    expect(receivedPNG).toEqual(expectedPNG);
  });
});
