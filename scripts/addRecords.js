const fetch = require('node-fetch');
const getJSON = require('../utils/getJSON.js');
const data = getJSON(process.env.FILES);

async function addRecord(type, name, value) {
  
  const response = await fetch(`https://api.is-a-good.dev/api/is-a-good-dev/zones/add?apiKey=${process.env.API_KEY}&type=${type}&name=${name}&content=${value}`);
  const data = await response.json();
  return data
}

(async () => {
    try {
        if (!data) return
        const records = Object.keys(data.target)
        for (const i in records) {
          recordType = records[i]
          name = data.target[recordType].name;
          value = data.target[recordType].value;
          const result = await addRecord(recordType, name, value);
          console.log(result);
        }
    } catch (e) {
        console.log("Error adding records")
        console.log(e)
    }
})();
