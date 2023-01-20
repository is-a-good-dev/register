const { checkIfValidIP, checkIfValidFQDN, checkInvalidDomain } =  require('./utils.js');

function checkRecords(data) {
    const recordType = Object.keys(data.target)[0];

    // Check if the domain is invalid
    if (checkInvalidDomain(data.target[recordType].name) === true) return false;

    // Check A record
    if (recordType.toLowerCase() === 'a') {
        for (const record of data.target[recordType].value) {
            if (checkIfValidIP(record) == false) return false;
        }
        return true;
    }

    // Check CNAME record
    if (recordType.toLowerCase() === 'cname') {
        return checkIfValidFQDN(data.target[recordType].value);
    }

    return false;
}

module.exports = checkRecords;
