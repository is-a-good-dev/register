const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "../sub-logs");

let combinedArray = [];

fs.readdir(directoryPath, function (err, files) {
    if(err) throw err;

    function removeValue(value, index, arr) {
        if(value === "reserved") {
            arr.splice(index, 1);
            return true;
        }

        return false;
    }

    files.filter(removeValue);

    files.forEach(function (file) {
        const filePath = path.join(directoryPath, file);

        fs.readFile(filePath, "utf8", (err, data) => {
            if(err) throw err;

            const dataArray = [JSON.parse(data)];

            for(const item of dataArray) {
                delete item.owner.email;

                item.domain = path.parse(file).name + ".is-a-good.dev";
            }

            combinedArray = combinedArray.concat(dataArray);

            if(combinedArray.length === files.length) {
                fs.writeFile("raw.json", JSON.stringify(combinedArray), (err) => {
                    if(err) throw err;
                })
            }
        })
    })
})
