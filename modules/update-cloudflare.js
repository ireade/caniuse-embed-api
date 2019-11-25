let config;

if (process.env.CLOUDFLARE_EMAIL) {
  config = require("../cloudflare-config");
} else {
  config = require("../cloudflare-config.secrets");
}

const fetch = require('node-fetch');
const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-Auth-Email': config.email,
  'X-Auth-Key': config.api_key
};

const cloudflareAPIBase = 'https://api.cloudflare.com/client/v4';

const fetchPageRule = () => {
  const pageRuleId = 'bfb990382de1cfadb25b0dec7c113b27';

  const url = `${cloudflareAPIBase}/zones/${config.zone_id}/pagerules`;
  const options = { headers: defaultHeaders };

  return fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      const pageRule = res.result.find((rule) => rule.id == pageRuleId);
      return pageRule;
    });
}

const updatePageRule = (pageRule) => {

  const url = `${cloudflareAPIBase}/zones/${config.zone_id}/pagerules/${pageRule.id}`;
  const options = { 
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify({
      targets: pageRule.targets,
      actions: [{
        id: pageRule.actions[0].id,
        value: {
          url: `https://res.cloudinary.com/ireaderinokun/image/upload/v${new Date().getTime()}/caniuse-embed/all/$1.$2`,
          status_code: 302
        }
      }]
    })
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((res) => console.log(res));
};

module.exports = async () => {
  try {
    const pageRule = await fetchPageRule();
    await updatePageRule(pageRule);
    return true;
  } catch(err) {
    console.log(err);
    return false;
  }
};
