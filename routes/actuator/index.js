const express = require('express');
const healthEndpoint = require('./health');

module.exports = () => {
  const router = express.Router();

  router.get('/actuator/health', healthEndpoint);

  return router;
};
