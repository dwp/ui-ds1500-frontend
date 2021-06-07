const Browser = require('zombie');
const chai = require('chai');
const expect = chai.expect;
const { CONFIRM_BTN } = require('./constants');

Browser.localhost('localhost', 3000);
Browser.silent = true;

const browser = new Browser();

before(function () {
  return browser.visit('/ds1500');
});

describe('validation: patientName', function () {
  it('should trigger error if left blank', function () {
    browser.fill('patientName', '');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientName-error .parsley-required', 'Enter your patient\'s name');
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('patientName', '!@#$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientName-error .parsley-pattern', "Patient's name can only contain letters, spaces, hyphens, apostrophes and full stops");
  });

  it('should accept standard names', function () {
    browser.fill('patientName', 'Dan Boscaro');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#patientName-error li')).not.to.exist; // eslint-disable-line
  });

  it('should accept names with spaces, hyphens, apostrophes and full stops', function () {
    browser.fill('patientName', 'Johny.Smith Dingle-Hauser O\'Tool');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#patientName-error li')).not.to.exist; // eslint-disable-line
  });
});
