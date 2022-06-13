const CONFUSABLES = require('./data/confusables.json');
const { ZERO_WIDTH, zeroWidths } = require('./helpers');

/**
 * Checks a given string and compares it to the confusables list, 
 * returning an array of chars that the string can be confused against.
 * @example <caption>Example usage of generateSkeleton</caption>
 * const { generateSkeleton } = require('...');
 * ...
 * const myString = "egreꜱꜱ";
 * generateSkeleton(myString);
 * // returns ['e', 'g', 'r', 'e', 'ꜱ', 'ꜱ']
 * @param {String} givenString - The given string to check against 
 * @returns {Array} - An array of characters
 */
const generateSkeleton = givenString => {
    return [...givenString].reduce((acc, char) => {
        if (zeroWidths.has(char)) return acc;
        acc.push(CONFUSABLES[char] || char);
        return acc;
    }, []);
};

/**
 * Checks if a given string contains confusable characters.
 * @example <caption>Example usage of containsConfusables</caption>
 * const { containsConfusables } = require('...');
 * ...
 * const myString = "egreꜱꜱ";
 * containsConfusables(myString);
 * // returns true
 * @param {String} givenString - The given string to check against 
 * @returns {Boolean} - true if the string is confusable, false otherwise
 */
const containsConfusables = givenString => {
    const skeleton = generateSkeleton(givenString);
    const originalString = [...givenString];
    for (let i = 0, l = skeleton.length; i < l; i++) {
        if (skeleton[i] !== originalString[i]) return true;
    }

    return false;
};

/**
 * Checks the given string then returns an array of characters 
 * and what they are similar to, if they are confusable.
 * @example <caption>Example usage of getConfusables</caption>
 * const { getConfusables } = require('...');
 * ...
 * const myString = "egreꜱꜱ";
 * getConfusables(myString);
 * // returns [{ char: 'e' }, { char: 'g' }, { char: 'r' }, { char: 'e' }, { char: 'ꜱ', similarTo: 's' }, { char: 'ꜱ', similarTo: 's' }]
 * @param {String} givenString - The given string to check against 
 * @returns {Array} - An array of characters and what they are similar to (if they are confusable) or undefined
 */
const getConfusables = givenString => {
    const skeleton = generateSkeleton(givenString);
    const originalString = [...givenString];
    let offset = 0;

    return originalString.reduce((acc, char, index) => {
        const target = skeleton[index - offset];
        if (target === char || !target) {
            acc.push({ char });
        } else if (zeroWidths.has(char)) {
            acc.push({ char, similarTo: ZERO_WIDTH });
            offset = offset + 1;
        } else {
            acc.push({ char, similarTo: target });
        }

        return acc;
    }, []);
};

/**
 * Rectifies a confusable string with whatever the characters can be confused with.
 * @example <caption>Example usage of rectifyConfusion</caption>
 * const { rectifyConfusion } = require('...');
 * ...
 * const myString = "egreꜱꜱ";
 * rectifyConfusion(myString);
 * // returns egress
 * @param {String} givenString - The given string to check against
 * @returns {String} - The fully rectified string
 */
const rectifyConfusion = givenString => {
    return getConfusables(givenString).map(({ char, similarTo }) => (
        similarTo == null ? char : similarTo
    )).join('');
};

module.exports = {
    generateSkeleton,
    containsConfusables,
    getConfusables,
    rectifyConfusion,
}
