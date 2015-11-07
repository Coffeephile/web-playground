'use strict';

class NoMoreFallbacksError extends Error {
  constructor() {
    super();
    Error.captureStackTrace(this, NoMoreFallbacksError);
    this.message = 'No more fallback candidates';
    this.name = 'NoMoreFallbacksError';
  }
}

module.exports = {
  NoMoreFallbacksError,
};
