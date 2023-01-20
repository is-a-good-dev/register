const { checkIfValidIP, checkIfValidIPv6, checkIfValidFQDN, checkInvalidDomain, isString } =  require('./utils.js');

function checkRecords(data) {
    const recordType = Object.keys(data.target)[0];
    const value = data.target[recordType].value;
    // Check if the domain is invalid
    if (checkInvalidDomain(data.target[recordType].name) === true) return false;
    
    // Check AAAA record
    if (recordType.toLowerCase() === 'aaaa') {
        if (!Array.isArray(value)) return false;
        for (const record of value) {
            if (checkIfValidIPv6(record) == false) return false;
        }
        return true;
    }
    // Check A record
    if (recordType.toLowerCase() === 'a') {
        if (!Array.isArray(value)) return false;
        for (const record of value) {
            if (checkIfValidIP(record) == false) return false;
        }
        return true;
    }

    // Check CNAME record
    if (recordType.toLowerCase() === 'cname') {
        if (!isString(value)) return false;
        return checkIfValidFQDN(value);
    }

    return false;
}

module.exports = checkRecords;
