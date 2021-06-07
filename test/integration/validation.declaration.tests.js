const { CONFIRM_BTN } = require('./constants');

const Browser = require('zombie');
const chai = require('chai');
const expect = chai.expect;

Browser.localhost('localhost', 3000);
Browser.silent = true;

const browser = new Browser();

before(function () {
  return browser.visit('/ds1500');
});

describe('validation: declaration', function () {
  it('should trigger error if not selected', function () {
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#declaration-error .parsley-required', 'Select your role');
  });

  it('should not trigger error if selected', function () {
    browser.choose('declaration', 'General Practitioner');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#declaration-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: gmcNumber', function () {
  it('should trigger error if left blank', function (done) {
    browser.choose('declaration', 'General Practitioner');
    browser.fill('gmcNumber', '');
    browser.pressButton(CONFIRM_BTN);
    function loaded (window) {
      return window.document.querySelector('#gmcNumber-error li');
    }
    browser.wait(loaded, function () {
      browser.assert.text('#gmcNumber-error li', 'Enter your GMC number');
      done();
    });
  });

  it('should trigger error if shorter than 7 charaters', function () {
    browser.fill('gmcNumber', '123456');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#gmcNumber-error .parsley-gmcpattern', 'GMC number must be 7 digits long');
  });

  it('should trigger error if longer than 7 charaters', function () {
    browser.fill('gmcNumber', '12345678');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#gmcNumber-error .parsley-maxlength', 'GMC numbers cannot be more than 7 digits long');
  });

  it('should trigger error if seven zeros are entered', function () {
    browser.fill('gmcNumber', '0000000');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#gmcNumber-error .parsley-pattern', 'GMC Numbers can only contain digits which cannot all be zeros');
  });

  it('should accept standard values', function () {
    browser.fill('gmcNumber', '1234567');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#gmcNumber-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: declarationAdditionalDetail', function () {
  it('should trigger error if left blank', function (done) {
    browser.choose('declaration', 'General Practitioner');
    browser.fill('declarationAdditionalDetail', '');
    browser.pressButton(CONFIRM_BTN);
    function loaded (window) {
      return window.document.querySelector('#declarationAdditionalDetail-error li');
    }
    browser.wait(loaded, function () {
      browser.assert.text('#declarationAdditionalDetail-error li', 'Please specify your relationship to the patient');
      done();
    });
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.choose('declaration', 'Other');
    browser.fill('declarationAdditionalDetail', '$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#declarationAdditionalDetail-error .parsley-invalidcharacters', 'Relationship to patient field contains invalid characters: $%&');
  });

  it('should accept standard values', function () {
    browser.fill('declarationAdditionalDetail', 'Brother');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#declarationAdditionalDetail-error li')).not.to.exist; // eslint-disable-line
  });
});
