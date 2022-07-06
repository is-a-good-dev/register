const core = require('@actions/core');
const getJSON = require('../utils/getJSON.js');
const checkInfo = require('../utils/checkInfo.js');
const checkRecords = require('../utils/checkRecords.js');
const data = getJSON(process.env.FILES);
core.setOutput('infoMessage', "Could not validate info.");
core.setOutput('recordMessage', "Could not validate records.");
test('check if json file has required info', async () => {
  const passed = await checkInfo(data);
  let infoMessage = passed === true ? "Valid Info Provided." : passed === "unknown" ? "Error Verifying Email.\nA maintainer will have to manually verify your email." : "Invalid Info Provided.\nPlease check your provided info."; 
  core.setOutput('infoMessage', infoMessage);
  expect(passed).toBeTruthy();
}, 15000);

test('check if json file follows format', () => {
  const passed = checkRecords(data);
  let recordMessage = passed === true ? "Valid Records Provided." : "Invalid Records Provided.\nPlease check your provided records.\nThey should only be of type `CNAME` or `A`"; 
  core.setOutput('recordMessage', recordMessage);
  expect(passed).toBe(true);
});
