const core = require('@actions/core');
const getJSON = require('../utils/getJSON.js');
const checkInfo = require('../utils/checkInfo.js');
const checkRecords = require('../utils/checkRecords.js');
const getFileName = require('../utils/getFileName.js');
const data = getJSON(process.env.FILES);

function setupMessages() {
  core.setOutput('infoMessage', "Could not validate info.");
  core.setOutput('recordMessage', "Could not validate records.");
  core.setOutput('jsonData', JSON.stringify(data, null, 2))
  core.setOutput('shouldComment', 'true')
};

function outputInvalidJsonFile() {
  core.setOutput('infoMessage', "Could not validate info.");
  core.setOutput('recordMessage', "Could not validate records.");
  core.setOutput('jsonData', "Could not read the JSON file, did you have an error in your syntax?")
  core.setOutput('shouldComment', 'true')
}

beforeAll(() => {
  setupMessages();
  if (data == 3) {
    outputInvalidJsonFile();

    console.log("ERROR: JSON file is invalid. Either the file is not JSON, or there is an error in the JSON syntax.");
    return process.exit(1)
  };
    
  if (data == false) {
    core.setOutput('shouldComment', 'false')
    console.log('INFO: File is not a subdomain JSON file.')
    return process.exit(0)
  }; 
});

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

test('Check if JSON file matches the value name', () => {
  const passed = getFileName(process.env.FILES, data);

  let fileNameMessage = passed === true ? "File name matches target.RECORD_TYPE." : "File name does not match any target.RECORD_TYPE.";

  core.setOutput('fileNameMessage', fileNameMessage);
  expect(passed).toBe(true);
});
