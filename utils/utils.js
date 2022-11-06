const invalidDomains = require('./invalid-domains.json');

module.exports.checkIfValidIP = function(str) {
  // Check if the IP address is valid
  const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

  return regexExp.test(str);
}

module.exports.checkIfValidFQDN = function(str) {
  // Check if the FQDN is valid
  const regexExp = /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/gi;

  return regexExp.test(str);
}

module.exports.checkInvalidDomain = function(str) {
  return invalidDomains.includes(str);
}
