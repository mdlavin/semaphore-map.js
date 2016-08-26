'use strict';
const SemaphoreMap = require('../src/index');
const sinon = require('sinon');

describe('#take', function () {
  it('when called with the same key twice, it uses the same semaphore', function () {
    const map = new SemaphoreMap();

    const key = 'test';
    const firstFunc = sinon.stub();
    map.take(key, firstFunc);
    sinon.assert.calledOnce(firstFunc);

    const secondFunc = sinon.stub();
    map.take(key, secondFunc);
    sinon.assert.notCalled(secondFunc);
  });

  it('does not include the leave function in the take callback', function () {
    const map = new SemaphoreMap();

    const key = 'test';
    const firstFunc = sinon.stub();
    map.take(key, firstFunc);
    sinon.assert.calledOnce(firstFunc);
    sinon.assert.calledWithExactly(firstFunc);
  });

  it('when called with different keys, different semaphores are used', function () {
    const map = new SemaphoreMap();

    const firstFunc = sinon.stub();
    map.take('key1', firstFunc);
    sinon.assert.calledOnce(firstFunc);

    const secondFunc = sinon.stub();
    map.take('key2', secondFunc);
    sinon.assert.calledOnce(secondFunc);
  });
});

describe('#leave', function () {
  it('unlocks other waiters using the same key', function () {
    const map = new SemaphoreMap();

    const key = 'test';
    const firstFunc = sinon.stub();
    map.take(key, firstFunc);
    sinon.assert.calledOnce(firstFunc);

    const secondFunc = sinon.stub();
    map.take(key, secondFunc);
    sinon.assert.notCalled(secondFunc);

    map.leave(key);
    // Leave only allows the waiting function to
    // execute after the next tick
    process.nextTick(function () {
      sinon.assert.calledOnce(secondFunc);
    });
  });
});
