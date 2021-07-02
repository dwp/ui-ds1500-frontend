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

describe('validation: gpName', function () {
  it('should trigger error if left blank', function () {
    browser.fill('gpName', '');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#gpName-error .parsley-required', 'Enter your name');
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('gpName', '!@#$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#gpName-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });

  it('should accept standard names', function () {
    browser.fill('gpName', 'Dr. Peter Capaldi');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#gpName-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: gpAddress', function () {
  it('should trigger error if left blank', function () {
    browser.fill('gpAddress', '');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#gpAddress-error .parsley-required', 'Enter your address');
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('gpAddress', '!@#$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#gpAddress-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });

  it('should accept standard addresses', function () {
    browser.fill('gpAddress', '93 Upwell St, Sheffield S4 8AN');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#gpAddress-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: gpPhone', function () {
  it('should trigger error if left blank', function () {
    browser.fill('gpPhone', '');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#gpPhone-error .parsley-required', 'Enter your phone number');
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('gpPhone', '!@#$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#gpPhone-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });

  it('should trigger error if an invalid format is entered', function () {
    browser.fill('gpPhone', '098765');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#gpPhone-error .parsley-pattern', 'Phone number is not a valid format');
  });

  it('should accept standard values', function () {
    browser.fill('gpPhone', '0114 2393939');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#gpPhone-error li')).not.to.exist; // eslint-disable-line
  });
});
