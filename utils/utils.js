module.exports.checkIfValidIP = function(str) {
  // Regular expression to check if string is a IP address
  const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi

  return regexExp.test(str);
};

module.exports.checkIfValidFQDN = function(str) {
  // Regular expression to check if string is a FQDN
  const regexExp = /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,63}?$/gi

  return regexExp.test(str);
};

