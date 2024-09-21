const { stripExt } = require('./utils.js');

function getFileName(file, data) {

      const fileNameWithoutExt = stripExt(file);
      
      // Validate if the file name matches any of the target.RECORD_TYPE values
      const recordTypes = Object.values(data.target);

      return recordTypes[0].name == fileNameWithoutExt.toLowerCase().split("/")[1];
}

module.exports = getFileName;
