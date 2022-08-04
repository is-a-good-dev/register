const fetch = require('node-fetch');
const core = require('@actions/core');

async function checkEmail(email) {
  console.log(`Checking: ${email}`)
  const url = `https://email-checker.p.rapidapi.com/verify/v1?email=${encodeURIComponent(email)}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.email_api_key,
      'X-RapidAPI-Host': 'email-checker.p.rapidapi.com'
    }
  };
  const res = await fetch(url, options).then(res => res.json());
  console.log(res);
  core.setOutput('infoReason', res.reason);
  if (res.status == "valid" && res.disposable != true) return true;
  if (res.status == "unknown" && res.disposable != true) return "unknown";
  return false;
}

async function checkInfo(data) {
  return await checkEmail(data.owner.email);
}

module.exports = checkInfo;
