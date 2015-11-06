'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const preStart = require('./preStart');
const Options = require('./util/Options');
const Log = require('./util/Log');

module.exports = Bluebird.coroutine(function *(_opts) {
  const opts = yield Options.mergeDefault(_opts);
  const hasCreatedFromTmpl = yield preStart(opts)[0];

  if (hasCreatedFromTmpl) {
    Log.info(`Run ${chalk.green('wpg')} again to start live-reload server`);
    return;
  }

  if (opts.bundle) {
    require('./bundle')(opts);
    return;
  }

  require('./start')(opts);
});
