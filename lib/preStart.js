'use strict';

const Bluebird = require('bluebird');
const R = require('ramda');
const Assets = require('./util/Assets');
const Functional = require('./util/Functional');
const Log = require('../lib/util/Log');
const File = require('./util/File');
const Playground = require('./util/Playground');
const PromiseUtil = require('./util/PromiseUtil');
const CONST = require('../lib/CONST');

const logCreateFile = Functional.later(Log.logCreateFile);

module.exports = Bluebird.coroutine(function *(opts) {
  const joinBase = File.join(opts.baseDir);
  let hasCreatedFromTmpl = false;
  let playgroundFilePath;
  let playgroundContent;

  try {
    const readPlaygroundFunc = R.converge(Bluebird.join, R.identity, R.compose(File.readFile, joinBase));
    const playgroundResults = yield PromiseUtil.tryInOrder(readPlaygroundFunc, CONST.PLAYGROUND_FILES);
    playgroundFilePath = playgroundResults[0];
    playgroundContent = playgroundResults[1];
  } catch (err) {
    Log.info('Did not find playground file, creating one...');
    hasCreatedFromTmpl = true;
    playgroundFilePath = joinBase(CONST.DEFAULT_PLAYGROUND_FILE);
    playgroundContent = yield File.readFile(CONST.PLAYGROUND_EXAMPLE);
    yield File.writeFile(playgroundFilePath, playgroundContent);
    logCreateFile(playgroundFilePath);
  }

  const playgroundExt = Playground.getExt(playgroundFilePath);
  const playground = Playground.parse(playgroundExt, playgroundContent);

  const htmlP = Assets.createAssetFileIfNotExistPromise(opts.baseDir, 'html', (ext) => {
    hasCreatedFromTmpl = true;
    return ext === 'html' ? File.readFile(CONST.HTML_EXAMPLE) : '';
  }, playground);

  const jsP = Assets.createAssetFileIfNotExistPromise(opts.baseDir, 'js', (ext) => {
    hasCreatedFromTmpl = true;
    return '';
  }, playground);

  const cssP = Assets.createAssetFileIfNotExistPromise(opts.baseDir, 'css', (ext) => {
    hasCreatedFromTmpl = true;
    return '';
  }, playground);

  yield Bluebird.join(htmlP, jsP, cssP);

  return hasCreatedFromTmpl;
});
