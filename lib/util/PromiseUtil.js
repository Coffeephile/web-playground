'use strict';

const Bluebird = require('bluebird');
const NoMoreFallbacksError = require('./Errors').NoMoreFallbacksError;

const fromObservable = (observableFactory) => new Bluebird((resolve, reject) => {
  const elements = [];

  observableFactory()
    .subscribe((ele) => elements.push(ele), reject, () => resolve(elements));
});

const tryInOrder = Bluebird.coroutine(function *(block, candidates) {
  const candidatesCopy = candidates.slice(0);

  while (candidatesCopy.length) {
    try {
      return yield block(candidatesCopy.shift());
    } catch (err) {
      // Swallow
    }
  }

  throw new NoMoreFallbacksError();
});

module.exports = {
  fromObservable,
  tryInOrder,
};
