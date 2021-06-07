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

describe('validation: patientNino', function () {
  it('should not trigger error if left blank', function () {
    browser.fill('patientNino', '');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#patientNino-error li')).not.to.exist; // eslint-disable-line
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('patientNino', '!@#$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientNino-error .parsley-pattern', 'National Insurance number is not a valid format');
  });

  it('should accept nino in the correct format', function () {
    browser.fill('patientNino', 'AA370773A');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#patientNino-error li')).not.to.exist; // eslint-disable-line
  });
});
