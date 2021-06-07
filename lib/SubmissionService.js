const rp = require('request-promise-native');

class SubmissionService {
  /**
   * Constructor.
   *
   * @param  {sting} serviceUrl Service URL
   * @param  {bool} sslEnabled Whether to call over TLS or not
   * @param  {string} sslClientKey Path to file holding client key
   * @param  {string} sslClientCert Path to file holding client cert
   * @param  {string} sslServerCA Path to file holding server CA
   */
  constructor (serviceUrl, sslEnabled, sslClientKey, sslClientCert, sslServerCA) {
    this.serviceUrl = serviceUrl.replace(/\/+$/, '');
    this.serviceTtl = 10000; // ms
    this.sslEnabled = sslEnabled;
    this.sslClientKey = sslClientKey;
    this.sslClientCert = sslClientCert;
    this.sslServerCA = sslServerCA;
  }

  /**
   * Prepare common options for HTTP(S) calls.
   *
   * @return {object} Options object
   */
  prepareRequestOptions () {
    let ck, cc, ca;
    // eslint-disable-next-line prefer-const
    ck = cc = ca = null;

    return {
      key: ck,
      cert: cc,
      ca: ca,
      resolveWithFullResponse: true,
      rejectUnauthorized: true,
      timeout: this.serviceTtl
    };
  }

  /**
   * Submit the application data to the service.
   *
   * @param  {object} data Data to transport
   * @return {Promise} Promise
   */
  sendApplication (data) {
    return rp(Object.assign({}, this.prepareRequestOptions(), {
      method: 'POST',
      uri: `${this.serviceUrl}/controller`,
      json: true,
      body: data
    })).then(function (res) {
      return res;
    }).catch(function (err) {
      throw err;
    });
  }
}

module.exports = SubmissionService;
