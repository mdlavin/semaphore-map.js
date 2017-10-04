'use strict';
const Semaphore = require('semaphore');

function SemaphoreMap (defaultSize) {
  if (defaultSize === undefined || defaultSize === null) {
    defaultSize = 1;
  }
  this._defaultSize = defaultSize;
  this._semaphores = new Map();
}

SemaphoreMap.prototype.take = function (key, fn) {
  let semaphore = this._semaphores.get(key);

  if (!semaphore) {
    semaphore = Semaphore(this._defaultSize);
    this._semaphores.set(key, semaphore);
  }

  return semaphore.take(function () {
    // Strip the semaphore argument from the take callback because
    // if the semaphore is leaked then it might be used to leave
    // instead of the keyed leave below
    fn();
  });
};

SemaphoreMap.prototype.leave = function (key) {
  const semaphore = this._semaphores.get(key);

  if (!semaphore) {
    throw new Error('There is no created semaphore for that key');
  }

  semaphore.leave();
  if (semaphore.current === 0) {
    this._semaphores.delete(key);
  }
};

module.exports = SemaphoreMap;
