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

describe('validation: formRequester', function () {
  it('should trigger error if not selected', function () {
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#formRequester-error .parsley-required', 'Select who asked you to complete this form');
  });

  it('should not trigger error if selected', function () {
    browser.choose('formRequester', 'Patient');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#formRequester-error li')).not.to.exist; // eslint-disable-line
  });
});
