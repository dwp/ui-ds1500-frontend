const { NotifyClient } = require('notifications-node-client');

module.exports = async (formData, notifyEmailTo, notifyApiKey, notifyProxyConfig) => {
  const templateId = 'f8eebde1-3603-4952-ae42-cd4b8d112b0a'
  const notifyClient = new NotifyClient(notifyApiKey);

  if (notifyProxyConfig) {
    notifyClient.setProxy(notifyProxyConfig);
  }

  return notifyClient
    .sendEmail(templateId, notifyEmailTo, {
      personalisation: {
        rating: formData.rating,
        feedback: formData.improvements
      }
    })
};
