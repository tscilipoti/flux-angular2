import Inspect from '../local/inspect';
import * as assert from 'assert';

/**
 * Simple unit tests.
 */
describe('Inspect', function () {
  it('clone works as expected.', function () {
    const sourceObject = {
      a: 1,
      b: 2,
      c: 3
    };
    const valuesObject = {
      c: 4
    };
    const cloneObject = Inspect.clone(sourceObject, valuesObject);
    assert.equal(cloneObject.a, 1, 'a is not correct');
    assert.equal(cloneObject.b, 2, 'a is not correct');
    assert.equal(cloneObject.c, 4, 'a is not correct');
  });
});
