const axios = require('axios');
const fs = require('fs');

const confusablesLink = 'https://unicode.org/Public/security/latest/confusables.txt';
const path = 'data/confusables.json';

const extractCodePoint = point => String.fromCodePoint(parseInt(point.trim(), 16));

const extract = entry => entry.trim().split(/\s+/g).map(x => extractCodePoint(x)).join('');

const processRawData = rawData => {
    // split the data into an array of individual lines
    const rawDataLines = rawData.split(/[\r\n]+/g);

    // go through each line
    return rawDataLines.map(x => {
        // trim the line so that we don't have any white space
        const trimmedLine = x.trim();
        // we don't care about anything that is not a valid code
        // so just ignore anything that begins with a # (comment)
        if (!trimmedLine || trimmedLine[0] === '#') return;
        // split into the variables we need 
        // we only care about the first two as they 
        // contain the actual codes we're looking for
        const split = trimmedLine.split(';');
        // extract the code points from the split
        const from = extract(split[0]);
        const to = extract(split[1]);
        return { from, to };
    }).reduce((acc, curr) => {
        // if we don't have a code point then we don't care
        if (!curr) return acc;
        // add the to code point to the array
        acc[curr.from] = curr.to;
        return acc;
    }, {});
};

(async () => {
    // get the data
    const { data } = await axios.get(confusablesLink);

    // parse it it into a single array
    const processedData = processRawData(data);

    // write that array to a JSON file for use
    fs.writeFileSync(path, JSON.stringify(processedData, null, ' '), 'utf8');
})();