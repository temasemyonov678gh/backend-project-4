#!/usr/bin/env node

import { program } from 'commander';
import process from 'node:process';
import pageLoader from '../src/index.js';

program
  .name('page-loader')
  .description('Page loader utility')
  .argument('<url>')
  .version('0.0.1')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .action((url) => {
    const options = program.opts();
    pageLoader(options.output, url);
  });

program.parse();
