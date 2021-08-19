const SubmissionService = require('../../lib/SubmissionService');
const logger = require('@dwp/govuk-casa/lib/Logger')('ds1500');
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

module.exports = {
  view: 'review.njk',
  id: 'review',
  fieldValidators: require('../field-validators/empty'),
  hooks: {
    prerender: function (req, res, next) {
      const waypointEditUrl = '/ds1500'
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
          'otherDiagnoses',
          'patientAware',
          'formRequester'
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
          'treatment',
          'otherIntervention'
        ],
        referrer: [
          'declaration',
          'declarationAdditionalDetail',
          'gmcNumber',
          'gmcNumberConsultant',
          'gpName',
          'gpAddress',
          'gpPhone'
        ]
      }

      const sectionNames = Object.getOwnPropertyNames(fieldSections)

      const jData = req.casa.journeyContext.getData().ds1500

      // const t = req.i18nTranslator.t.bind(req.i18nTranslator);

      const createOptions = {
        t: req.i18nTranslator.t.bind(req.i18nTranslator),
        journeyData: jData,
        waypointEditUrl
      }

      // populate reviewSections variable for use in template context to render GovUK summary list
      const reviewSections = {}
      sectionNames.forEach((sectionName) => {
        const fieldNames = fieldSections[sectionName]
        reviewSections[sectionName] = fieldNames.map(createSummaryItem.bind(this, createOptions))
      })

      res.locals = {
        ...res.locals,
        jData,
        reviewSections
      }
      next()
    },
    postvalidate: async function (req, res, next) {
      const serviceUrl = appConfig.DS1500_CONTROLLER_URL
      const formData = req.casa.journeyContext.getData().ds1500
      const serviceData = formatServiceData(formData)
      let response
      try {
        response = await submissionService.sendApplication(serviceData);
      } catch (errors) {
        if (errors instanceof Error) {
          logger.error('Error submitting application to DS1500 Controller', errors.message);
          res.status(503).render('casa/errors/503', {
            sessionid: encodeURIComponent(req.session.id),
            appVersion: appVersion
          });
        } else {
          res.locals = {
            ...res.locals,
            sessionid: encodeURIComponent(req.session.id),
            appVersion: appVersion,
            formData: formData,
            formErrors: errors
          }

          req.session.save(() => {
            const redirectPath = whiteListValidateRedirect('ds1500')
            if (redirectPath) {
              res.redirect(encodeURI('/' + redirectPath))
            } else {
              res.status(500).render('casa/errors/500');
            }
          })
        }
      }

      if (typeof response.body.id !== 'undefined') {
        logger.info('DS1500 sent successfully');

        req.session.downloadContext = {
          ninoComplete: req.body.patientNino !== '',
          sessionid: encodeURIComponent(req.session.id),
          appVersion: appVersion,
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
          appVersion: appVersion
        });
      }
    }
  }
}
