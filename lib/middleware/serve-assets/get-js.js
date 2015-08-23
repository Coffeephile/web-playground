'use strict';

var curryRight = require('lodash/function/curryRight');
var curry = require('lodash/function/curry');
var get = require('lodash/object/get');
var jsProcessor = require('../../js');
var readFileAsync = require('../../util/read-file-async');

var getPreprocessor = curryRight(get, 3)('js.preprocessor', 'js');

module.exports = function getJs(req, res) {
  var playground = req.playground;

  var preprocessor = getPreprocessor(playground);

  var render = curry(jsProcessor.render)({preprocessor: preprocessor});

  var send = res.send.bind(res);

  readFileAsync('./javascript.js')
    .then(render)
    .done(send);
};