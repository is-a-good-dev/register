const fs = require('fs');
const { getFileExtension } = require('./utils.js');
const core = require('@actions/core');

function getJSON(file, filename) {
  const path = `${process.env.actions_path}/${file}`; // File path.
  const ext = getFileExtension(file);
  if (path.includes("sub-logs") && !ext || ext != 'json') return 3 //if file is subdomain file but has no ext or diff ext than .json
  if (!ext) return false; // If no file extension, return.
  if (ext != 'json') return false; // If file extension is not '.json' return.
  
  try {
    if (fs.existsSync(path)) { // Check if file exists in domain directory
      // It exists
      const rawdata = fs.readFileSync(path); // Read the file
      const data = JSON.parse(rawdata); // Parse it
      return data; // Return true or false, depending if tests pass or fail.
    }
    return 3; // It doesn't exist
  } catch(err) {
    core.setOutput('infoMessage', "Could not validate info.");
    core.setOutput('recordMessage', "Could not validate records.");
    core.setOutput('jsonData', "Could not read the JSON file, did you have an error in your syntax?")
    core.setOutput('shouldComment', 'true')
    console.log(err);
    return 3;
  }
  return 3;
}

module.exports = getJSON; 
