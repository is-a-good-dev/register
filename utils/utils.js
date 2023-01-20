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
  const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm;

  return regexExp.test(str);
}

function checkIfValidIPv6(str) {
  // Insane regex to check if IPv6 address is valid.
  const regexExp = /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/gm;
  
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
  checkIfValidIPv6,
  stripExt,
  getFileExtension, 
  getFiles,
  isString
}
