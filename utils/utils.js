const invalidDomains = require('./invalid-domains.json');
const fs = require('fs');
const core = require('@actions/core');

function getFiles(path) {
  // Get all files in path: returns array
  const allFiles = fs.readdirSync(path);
  
  return allFiles;
}

function getFileExtension(filename) {
  // Get file extension
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}

function stripExt(filename) {
  // Remove file extension
  return filename.substr(0, filename.lastIndexOf('.'));
}

function checkIfValidIP(str) {
  // Check if the IP address is valid
  const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

  return regexExp.test(str);
}

function checkIfValidFQDN(str) {
  // Check if the FQDN is valid
  const regexExp = /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/gi;

  return regexExp.test(str);
}

function checkInvalidDomain(str) {
  // Check invalid domains
  if (invalidDomains.includes(str)) {
    core.setOutput("recordInfo", "This subdomain has been blocked.")
    return true;
  }

  // Check reserved domains
  const files = getFiles("./sub-logs/reserved/").map(file => stripExt(file));

  if (files.includes(str)) {
    core.setOutput("recordInfo", "This subdomain has been reserved by the is-a-good.dev team.")
    return true;
  }

  return false;
}

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

module.exports = { 
  checkInvalidDomain, 
  checkIfValidFQDN, 
  checkIfValidIP,
  stripExt,
  getFileExtension, 
  getFiles,
  isString
}
