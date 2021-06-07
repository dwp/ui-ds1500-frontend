module.exports = (env) => {
  validateRequiredInt('SERVER_PORT');
  validateRequiredString('DS1500_CONTROLLER_URL');
  validateRequiredString('NOTIFY_EMAILTO');
  validateRequiredString('NOTIFY_APIKEY');
  validateRequiredString('NOTIFY_PROXY_HOST');
  validateRequiredInt('NOTIFY_PROXY_PORT');

  /* --------------------------------------------------------------------- SSL */

  validateBool('SERVER_SSL_ENABLED');

  if (env.SERVER_SSL_ENABLED) {
    validateRequiredString('SERVER_SSL_KEYFILE');
    validateRequiredString('SERVER_SSL_CERTFILE');
    validateRequiredString('SERVER_SSL_CACERTFILE');
  }

  /* --------------------------------------------------------------- sessions */

  validateRequiredString('SESSIONS_SECRET');
  validateRequiredInt('SESSIONS_TTL');

  if (env.REDIS_PORT && env.REDIS_HOST) {
    validateRequiredInt('REDIS_PORT');
    validateRequiredString('REDIS_HOST');
    validateBool('REDIS_CLUSTER');
  }

  function validateBool (v) {
    if (typeof env[v] !== 'undefined') {
      env[v] = env[v] === 'true';
    } else {
      env[v] = false;
    }
  }

  function validateRequiredString (v) {
    if (typeof env[v] === 'undefined') {
      throw new Error(`${v} is missing`);
    } else if (typeof env[v] !== 'string') {
      throw new Error(`${v} must be a string`);
    } else if (env[v].length === 0) {
      throw new Error(`${v} is missing`);
    }
  }

  function validateRequiredInt (v) {
    if (typeof env[v] === 'undefined') {
      throw new Error(`${v} is missing`);
    } else if (isNaN(parseInt(env[v])) || parseInt(env[v]) < 0) {
      throw new Error(`${v} must be a positive integer`);
    } else {
      env[v] = parseInt(env[v]);
    }
  }
};
