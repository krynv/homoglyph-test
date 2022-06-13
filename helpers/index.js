const ZERO_WIDTH = '';
const zeroWidths = new Set([
    '\u200b', // zero width space
    '\u200c', // zero width non-joiner
    '\u200d', // zero width join
    '\ufeff', // zero width no-break space
    '\u2028', // line
    '\u2029', // paragraph
]);

module.exports = { ZERO_WIDTH, zeroWidths };