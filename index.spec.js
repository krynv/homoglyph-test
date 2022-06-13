const { expect } = require('chai');
const { generateSkeleton, containsConfusables, getConfusables, rectifyConfusion } = require('./');

const CONFUSING = {
    'egreꜱꜱ': [
        { char: 'e' },
        { char: 'g' },
        { char: 'r' },
        { char: 'e' },
        { char: 'ꜱ', similarTo: 's' },
        { char: 'ꜱ', similarTo: 's' }
    ],
    'tеst': [
        { char: 't' },
        { char: 'е', similarTo: 'e' },
        { char: 's' },
        { char: 't' }
    ],
    '𝐫ｅꜱ𝘁': [
        { char: '𝐫', similarTo: 'r' },
        { char: 'ｅ', similarTo: 'e' },
        { char: 'ꜱ', similarTo: 's' },
        { char: '𝘁', similarTo: 't' }
    ],
    'ﻔ': [
        { char: 'ﻔ', similarTo: 'ف' }
    ],
    '塞': [
        { char: '塞', similarTo: '塞' }
    ],
};

const NOT_CONFUSING = [
    'dave',
    '🤬',
    '力'
];

describe('generateSkeleton', () => {
    it('should generate a skeleton of a given string', () => {
        expect(generateSkeleton('egreꜱꜱ')).to.deep.equal(['e', 'g', 'r', 'e', 's', 's']);
        expect(generateSkeleton('tеst')).to.deep.equal(['t', 'e', 's', 't']);
        expect(generateSkeleton('𝐫ｅꜱ𝘁')).to.deep.equal(['r', 'e', 's', 't']);
        expect(generateSkeleton('ﻔ')).to.deep.equal(['ف']);
        expect(generateSkeleton('塞')).to.deep.equal(['塞']);
        expect(generateSkeleton('e')).to.deep.equal(['e']);
    });
});

describe('containsConfusables', () => {
    it('should classify a confusable string/ char', () => {
        Object.keys(CONFUSING).forEach((string) => {
            expect(containsConfusables(string)).to.equal(true);
        });
    });

    it('should not classify a non confusable string/ char', () => {
        NOT_CONFUSING.forEach((string) => {
            expect(containsConfusables(string)).to.equal(false);
        });
    });
});

describe('getConfusables', () => {
    it('should return the full confusable string/ char', () => {
        Object.keys(CONFUSING).forEach((string) => {
            expect(getConfusables(string)).to.deep.equal(CONFUSING[string]);
        });
    });

    it('should not classify a non confusable string/ char', () => {
        NOT_CONFUSING.forEach((string) => {
            getConfusables(string).forEach((char) => {
                expect(char.similarTo).to.equal(undefined);
            });
        });
    });
});

describe('rectifyConfusion', () => {
    it('should convert a confusable string/ char into a non confusable string/ char', () => {
        expect(rectifyConfusion('egreꜱꜱ')).to.equal('egress');
        expect(rectifyConfusion('tеst')).to.equal('test');
        expect(rectifyConfusion('𝐫ｅꜱ𝘁')).to.equal('rest');
        expect(rectifyConfusion('ﻔ')).to.equal('ف');
        expect(rectifyConfusion('塞')).to.equal('塞');
    });

    it('should not convert a non confusable string/ char', () => {
        NOT_CONFUSING.forEach((string) => expect(rectifyConfusion(string)).to.equal(string));
    });
});
