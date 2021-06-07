const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { assert } = chai;

const notifyService = require('../../../lib/NotifyService.js');

describe('Notify service', () => {
  let notifyTemplateData = {
    screen: 'conditions',
    rating: 'Satisfied',
    improvements: '',
    emailAddress: ''
  };
  let notifyApiKey = 'dwp_ds1500test-f0cde76d-05b0-4a1e-a8eb-6fe18dbc58fc-2528b5b6-8508-4cf5-81c4-8bc28301c051';
  let notifyEmailTo = 'dwp.digitalds1500@dwp.gsi.gov.uk';
  const notifyProxy = null;

  it('should set up the notify service, send a feedback email, and return a resolved promise', async () => {
    await assert.isFulfilled(notifyService(notifyTemplateData, notifyEmailTo, notifyApiKey, notifyProxy));
  });

  it('should return a rejected promise if it gets an error from the notify service', async () => {
    notifyApiKey = 'test';
    await assert.isRejected(notifyService(notifyTemplateData, notifyEmailTo, notifyApiKey, notifyProxy));
  });

  it('Should reject if formData was empty', async () => {
    notifyTemplateData = {}
    await assert.isRejected(notifyService(notifyTemplateData, notifyEmailTo, notifyApiKey, notifyProxy));
  })

  it('Should reject if inconsistent formData was empty', async () => {
    notifyTemplateData = {
      screen: 'conditions',
      rating: 'Satisfied',
      improvements: ''
    }
    await assert.isRejected(notifyService(notifyTemplateData, notifyEmailTo, notifyApiKey, notifyProxy));
  })

  it('Should reject if notifyEmailTo was wrong', async () => {
    notifyEmailTo = 'test.go.uk'
    await assert.isRejected(notifyService(notifyTemplateData, notifyEmailTo, notifyApiKey, notifyProxy));
  })
});
