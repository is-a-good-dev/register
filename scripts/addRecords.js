const fetch = require('node-fetch');
const getJSON = require('../utils/getJSON.js');
const data = getJSON(process.env.FILES);
const arrayRecordTypes = ["a", "aaaa"];
async function addRecord(type, name, value) {
  const response = await fetch(`https://api.is-a-good.dev/api/is-a-good-dev/zones/add?apiKey=${process.env.API_KEY}&type=${type.toUpperCase()}&name=${name}&content=${value}`);
  const data = await response.json();

  return data;
}

(async () => {
    try {
      if (!data) return;

      const records = Object.keys(data.target);
      for (const i in records) {
        const recordType = records[i];
        const name = data.target[recordType].name;
        const value = data.target[recordType].value;
        console.log(`Adding record type ${recordType} with values ${name}, ${value}`);
        if (arrayRecordTypes.includes(recordType.toLowerCase()) != true) {
          let res = await addRecord(recordType, name, value);
          return console.log(res);
        }
        for (const ip of value) {
          let res = await addRecord(recordType, name, ip);
          console.log(res);
        }
      }
    } catch(e) {
      console.log('Failed to add records.');
      console.log(e);
    }
})();
