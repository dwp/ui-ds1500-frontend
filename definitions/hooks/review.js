const SubmissionService = require('../../lib/SubmissionService');
const dwpNodeLogger = require('@dwp/node-logger');
const logger = dwpNodeLogger('api');
const { formatServiceData } = require('../../utils/submission-service')
const { createSummaryItem } = require('../../utils/review')
const appVersion = require('../../package.json').version;
const whiteListValidateRedirect = require('../../lib/whiteListValidateRedirect')

// Load app config from `.env`
const appConfig = Object.assign({}, process.env);

try {
  require('../../lib/EnvValidator')(appConfig);
} catch (e) {
  console.log('Environment is misconfigured');
  console.error(e)
  process.exit(1);
}
if (appConfig.NOTIFY_PROXY === 'null') {
  appConfig.NOTIFY_PROXY = null;
}

// Create an instance of the submission service
const submissionService = new SubmissionService(
  appConfig.DS1500_CONTROLLER_URL,
  appConfig.SERVER_SSL_ENABLED,
  appConfig.SERVER_SSL_KEYFILE,
  appConfig.SERVER_SSL_CERTFILE,
  appConfig.SERVER_SSL_CACERTFILE
);

const prerender = (req, res, next) => {
  const waypointEditUrl = '/sr1'
  const fieldSections = {
    patientDetails: [
      'patientName',
      'patientAddress',
      'patientPostcode',
      'patientDateOfBirth',
      'patientNino'
    ],
    diagnosis: [
      'diagnosis',
      'dateOfDiagnosis',
      'dateOfSpecialRules',
      'otherDiagnoses',
      'diagnosisAware',
      'patientAware'
    ],
    representative: [
      'representativeName',
      'representativeAddress',
      'representativePostcode'
    ],
    clinicalFeatures: [
      'clinicalFeatures'
    ],
    treatment: [
      'treatment'
    ],
    referrer: [
      'declaration',
      'declarationAdditionalDetail',
      'gmcNumber',
      'gmcNumberConsultant',
      'gpName',
      'gpAddress',
      'gpPostcode',
      'gpPhone'
    ]
  }

  const sectionNames = Object.getOwnPropertyNames(fieldSections)

  const jData = req.casa.journeyContext.getData().sr1

  const createOptions = {
    t: req.t.bind(req),
    journeyData: jData,
    waypointEditUrl
  }

  // populate reviewSections variable for use in template context to render GovUK summary list
  const reviewSections = {}
  sectionNames.forEach((sectionName) => {
    const fieldNames = fieldSections[sectionName]
    reviewSections[sectionName] = fieldNames.map(createSummaryItem.bind(this, createOptions))
  })

  reviewSections.patientDetails[0].key.text = 'Name';
  reviewSections.diagnosis[0].key.text = 'Diagnosis';
  reviewSections.diagnosis[1].key.text = 'Date of diagnosis';
  reviewSections.diagnosis[2].key.text = 'Date the patient met the Special Rules';
  if (reviewSections.diagnosis[3]) {
    reviewSections.diagnosis[3].key.text = 'Other relevant diagnoses';
  }
  reviewSections.diagnosis[4].key.text = 'Patient aware of diagnosis';
  reviewSections.diagnosis[5].key.text = 'Patient aware of prognosis';
  reviewSections.clinicalFeatures[0].key.text = 'Details of the clinical features';
  reviewSections.treatment[0].key.text = 'Purpose of treatment and response';
  reviewSections.referrer[0].key.text = 'Role';
  if (reviewSections.referrer[2]) {
    reviewSections.referrer[2].key.text = 'GMC number';
  }
  if (reviewSections.referrer[3]) {
    reviewSections.referrer[3].key.text = 'GMC number';
  }
  reviewSections.referrer[4].key.text = 'Name';
  reviewSections.referrer[5].key.text = 'Organisation’s address';
  reviewSections.referrer[7].key.text = 'Phone number';
  res.locals = {
    ...res.locals,
    jData,
    reviewSections
  }
  next()
};

const postvalidate = async (req, res, next) => {
  const serviceUrl = appConfig.DS1500_CONTROLLER_URL
  const formData = req.casa.journeyContext.getData().sr1
  const serviceData = formatServiceData(formData)
  let response
  try {
    response = await submissionService.sendApplication(serviceData);
    if (typeof response.body.id !== 'undefined') {
      logger.info('DS1500 sent successfully');

      req.session.downloadContext = {
        ninoComplete: req.body.patientNino !== '',
        sessionid: encodeURIComponent(req.session.id),
        appVersion,
        showFeeForm: serviceData.declaration === 'General Practitioner' || serviceData.declaration === 'GMC registered consultant',
        transactionID: response.body.id,
        controllerUrl: serviceUrl,
        json: JSON.stringify(serviceData)
      }

      req.session.save()
      next()
    } else {
      logger.error('Error in DS1500 Controller - ' + response.body);
      res.status(503).render('casa/errors/503', {
        sessionid: encodeURIComponent(req.session.id),
        appVersion
      });
    }
  } catch (errors) {
    if (errors instanceof Error) {
      logger.error('Error submitting application to DS1500 Controller', errors.message);
      res.status(503).render('casa/errors/503', {
        sessionid: encodeURIComponent(req.session.id),
        appVersion
      });
    } else {
      res.locals = {
        ...res.locals,
        sessionid: encodeURIComponent(req.session.id),
        appVersion,
        formData,
        formErrors: errors
      }

      req.session.save(() => {
        const redirectPath = whiteListValidateRedirect('sr1')
        if (redirectPath) {
          res.redirect(encodeURI('/' + redirectPath))
        } else {
          res.status(500).render('casa/errors/500');
        }
      })
    }
  }
};

module.exports = () => ({
  prerender,
  postvalidate
});
