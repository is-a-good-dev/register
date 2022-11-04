const fs = require("fs");

function getFileExtension(filename) {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}

const invalidDomains = [
  "_acme-challenge",
  "_github-challenge-is-a-good-dev",
  "_github-pages-challenge-is-a-good-dev",
  "help",
  "no-reply",
  "noreply",
  "notification",
  "notifications",
  "support",
  "ww",
  "ww1",
  "ww2",
  "ww3",
  "ww4",
  "wwww",
  "your-domain-name"
]

function getJSON(file, filename) {
  const path = `${process.env.actions_path}/${file}`; // File path.
  const ext = getFileExtension(file);

  if(!ext) return false; // If no file extension, return.
  if(ext != "json") return false; // If file extension is not ".json" return.

  invalidDomains.forEach(domain => {
    if(filename === domain) return false;
  })

  try {
    if(fs.existsSync(path)) { // Check if file exists in domain directory
      // It exists
      const rawdata = fs.readFileSync(path); // Read the file
      const data = JSON.parse(rawdata); // Parse it
      return data; // Return true or false, depending if tests pass or fail.
    }

    return false; // It doesn't exist
  } catch(err) {
    console.error(err);
  }

  return false;
}

module.exports = getJSON; 
