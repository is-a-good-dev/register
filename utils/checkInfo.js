const fetch = require('node-fetch');
const core = require('@actions/core');

async function checkEmail(email) {
  console.log(`Checking: ${email}`);

  const url = `https://api.is-a-good.dev/email-check?key=6lPyUV2dX8&email=${encodeURIComponent(email)}`;

  const options = {
    method: 'GET'
  }

  const res = await fetch(url, options).then(res => res.json());
  console.log(res);

  core.setOutput('infoReason', res.reason);

  if (res.data.valid) return true;

  return false;
}

async function checkInfo(data) {
  return await checkEmail(data.owner.email);
}

module.exports = checkInfo;
