const fs = require('fs');
function getFileExtension(filename) {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}
function getJSON(file) {
  const path = `${process.env.actions_path}/${file}`; //json file path.
  const ext = getFileExtension(file)
  if (!ext) return false; //if no file extension, return.
  if (ext != "json") return false; //if file extension is not ".json" return.
  try {
      if (fs.existsSync(path)) { //check if file exists in domain directory
        //it exists 
        const rawdata = fs.readFileSync(path); //read the file
        const data = JSON.parse(rawdata); //parse it
        return data; //return true or false, depending if tests pass or fail.
      };
      return false; //it doesn't exist
  } catch(err) {
    console.error(err);
  };
  return false;
};
module.exports = getJSON; 
