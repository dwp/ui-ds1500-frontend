const Browser = require('zombie');

Browser.localhost('localhost', 3000);
Browser.silent = true;

describe('ds1500 start page', function () {
  const browser = new Browser();

  before(function () {
    return browser.visit('/sr1-start');
  });

  it('should be successful', function () {
    browser.assert.success();
  });

  it('should have the correct heading', function () {
    browser.assert.text('h1', 'Report a terminally ill patient (form DS1500)');
  });

  it('should navigate to the form page by clicking the link', function (done) {
    browser.clickLink('Start now', function () {
      browser.assert.text('h1', 'Patient details');
      done();
    });
  });
});
