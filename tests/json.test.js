const core = require('@actions/core');
const getJSON = require('../utils/getJSON.js');
const checkInfo = require('../utils/checkInfo.js');
const checkRecords = require('../utils/checkRecords.js');
const data = getJSON(process.env.FILES);

if (data == 3) {
    core.setOutput('infoMessage', "Could not validate info.");
    core.setOutput('recordMessage', "Could not validate records.");
    core.setOutput('jsonData', "Could not read the JSON file, did you have an error in your syntax?")
    core.setOutput('shouldComment', 'true')
    process.exit(0)
}

if (data == false) {
    core.setOutput('shouldComment', 'false')
    console.log('Not a subdomain file')
    process.exit(0)
}

core.setOutput('infoMessage', "Could not validate info.");
core.setOutput('recordMessage', "Could not validate records.");
core.setOutput('jsonData', JSON.stringify(data, null, 2))
core.setOutput('shouldComment', 'true')
test('check if json file has required info', async () => {
  const passed = await checkInfo(data);
  let infoMessage = passed === true ? "Valid information provided." : passed === "unknown" ? "Error verifying email address.\nA maintainer will have to manually verify your email address.\nReason:" : "Invalid information provided.\nPlease check your provided information.\nReason:"; 

  core.setOutput('infoMessage', infoMessage);
  expect(passed).toBeTruthy();
}, 15000);

test('Check if JSON file follows format', () => {
  const passed = checkRecords(data);
  let recordMessage = passed === true ? "Valid records provided." : "Invalid records provided.\nPlease check your provided records.\nThey should only be of type `A`, `CNAME` or `TXT`, and should follow their respective formats."; 

  core.setOutput('recordMessage', recordMessage);
  expect(passed).toBe(true);
});
