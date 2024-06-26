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

describe('validation: diagnosisAware', function () {
  it('should trigger error if not selected', function () {
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#diagnosisAware-error .parsley-required', 'Select if your patient is aware of their condition');
  });

  it('should not trigger error if selected', function () {
    browser.choose('diagnosisAware', 'Yes');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#diagnosisAware-error li')).not.to.exist; // eslint-disable-line
  });
});
