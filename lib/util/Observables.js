'use strict';

const assert = require('assert');
const R = require('ramda');
const Observable = require('rx').Observable;
const NoMoreFallbacksError = require('./Errors').NoMoreFallbacksError;

const createFallbacks = (candidates) => {
  assert(candidates.length > 0, 'candidates must contain at least one element');
  let i = -1;
  return Observable.defer(() => {
    i += 1;
    if (i >= candidates.length) {
      throw new NoMoreFallbacksError();
    }
    const c = candidates[i];
    return Observable.just(c);
  });
};

const tryInOrder = R.curry((selector, candidates) =>
  createFallbacks(candidates).flatMap(selector).retry(candidates.length + 1));

module.exports = {
  createFallbacks,
  tryInOrder,
};
