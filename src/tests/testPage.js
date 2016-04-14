/* eslint-env node, mocha */
import SimplePage from './fixtures/simpleApp/simplePage';
import CountPage from './fixtures/countApp/countPage';
import QuestionPage from './fixtures/questionApp/questionPage';
import PageBuilder from '../local/pageBuilder';
import * as jsdom from 'jsdom';
import * as assert from 'assert';

/**
 * Simple unit tests.
 */
describe('Page', function () {
  it('Simple page renders as expected.', function (done) {
    const pb = new PageBuilder();
    const page = new SimplePage();
    global.document = jsdom.jsdom(pb.renderToString(page));

    page.load().then(function () {
      const span = document.querySelector('span');
      assert.ok(span, 'could not find span element');
      assert.equal(span.innerHTML, 'Details', 'span does not have correct value');
      done();
    }).catch(function (err) {
      done(err);
    });
  });

  it('Page with events renders and behaves as expected.', function (done) {
    const pb = new PageBuilder();
    const page = new CountPage();
    global.document = jsdom.jsdom(pb.renderToString(page));

    page.load().then(function () {
      page.tick();
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
    }).catch(function (err) {
      done(err);
    });
  });

  it('QuestionPage renders and behaves as expected.', function (done) {
    const pb = new PageBuilder();
    const page = new QuestionPage();
    global.document = jsdom.jsdom(pb.renderToString(page));

    page.load().then(function () {
      page.tick();
      let questionSize = document.querySelector('#questionSize');
      const questionAdd = document.querySelector('#questionAdd');

      assert.ok(questionSize, 'could not find questionSize element');
      assert.equal(questionSize.innerHTML, '0', 'questionSize has incorrect value.');
      assert.ok(questionAdd, 'could not find questionAdd element');

      // simulate a click on the increment count element.
      questionAdd.dispatchEvent(new Event('click'));
      page.tick();

      setTimeout(function () {
        questionSize = document.querySelector('#questionSize');
        assert.ok(questionSize, 'could not find questionSize element after click.');
        assert.equal(questionSize.innerHTML, '1', 'questionSize has incorrect value after click.');
        done();
      }, 100);
    }).catch(function (err) {
      done(err);
    });
  });
});
