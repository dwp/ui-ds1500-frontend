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

describe('validation: patientAddress', function () {
  it('should trigger error if left blank', function () {
    browser.fill('patientAddress', '');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientAddress-error .parsley-required', 'Enter your patient\'s address');
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('patientAddress', '!@#$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#patientAddress-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });

  it('should accept standard addresses', function () {
    browser.fill('patientAddress', '10 street name, town name, city name');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#patientAddress-error li')).not.to.exist; // eslint-disable-line
  });
});
