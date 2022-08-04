const { checkIfValidIP, checkIfValidFQDN } =  require('./utils.js');
function checkRecords(data) {
    const recordType = Object.keys(data.target)[0]
    if (recordType.toLowerCase() === "a") {
        return checkIfValidIP(data.target[recordType])
    }
    if (recordType.toLowerCase() === "cname") {
        return checkIfValidFQDN(data.target[recordType])
    }
    return false;
}
module.exports = checkRecords;
