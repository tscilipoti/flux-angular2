/* eslint-env node, mocha */
import SimplePage from './fixtures/simpleApp/simplePage';
import SubPage from './fixtures/subsApp/subPage';
import DetailPage from './fixtures/masterApp/detailPage';
import CountPage from './fixtures/countApp/countPage';
import * as assert from 'assert';

/**
 * Simple unit tests.
 */
describe('Page', function () {
  it('Simple page renders as expected.', function (done) {
    const page = new SimplePage({ isDevContext: true });
    page.load();

    setTimeout(function () {
      const span = document.querySelector('span');
      assert.ok(span, 'could not find span element');
      assert.equal(span.innerHTML, 'Details', 'span does not have correct value');
      done();
    }, 100);
  });

  it('Page routing works as expected.', function (done) {
    const page = new SubPage({ isDevContext: true });
    page.load();

    setTimeout(function () {
      let span = document.querySelector('span');
      assert.ok(span, 'could not find span element');
      assert.equal(span.innerHTML, 'One', 'span does not have correct value');

      page.routeSubTwo();
      setTimeout(function () {
        span = document.querySelector('span');
        assert.ok(span, 'could not find span element');
        assert.equal(span.innerHTML, 'Two', 'span does not have correct value');
        done();
      }, 100);
    }, 100);
  });

  it('Page with master renders as expected.', function (done) {
    const page = new DetailPage({ isDevContext: true });
    page.load();
    setTimeout(function () {
      const spans = document.querySelectorAll('span');
      assert.ok(spans, 'could not find spans');
      assert.equal(spans.length, 3, 'incorrect number of spans');
      assert.equal(spans[0].innerHTML, 'Start', 'first span has incorrect value.');
      assert.equal(spans[1].innerHTML, 'Details', 'second span has incorrect value.');
      assert.equal(spans[2].innerHTML, 'End', 'third span has incorrect value.');
      done();
    }, 100);
  });

  it('Page with events renders and behaves as expected.', function (done) {
    const page = new CountPage({ isDevContext: true });
    page.load();
    setTimeout(function () {
      let displayCount = document.querySelector('#countDisplay');
      const incrementCount = document.querySelector('#countIncrement');

      assert.ok(displayCount, 'could not find countDisplay element');
      assert.equal(displayCount.innerHTML, '0', 'countDisplay has incorrect value.');
      assert.ok(incrementCount, 'could not find countIncrement element');

      // simulate a click on the increment count element.
      incrementCount.dispatchEvent(new Event('click'));
      page.tick();

      setTimeout(function () {
        displayCount = document.querySelector('#countDisplay');
        assert.ok(displayCount, 'could not find countDisplay element after click.');
        assert.equal(displayCount.innerHTML, '1', 'countDisplay has incorrect value after click.');
        done();
      }, 100);
    }, 100);
  });
});
