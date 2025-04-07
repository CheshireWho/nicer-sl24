/**
 * Helper to compare texts
 */
const textComparison = () => {
    const resultCodes = {
        IDENTICAL: 'identical',
        PARTIAL_MATCH: 'partialMatch',
        NO_MATCH: 'noMatch'
    };

    // check if texts are a perfect match
    function isIdentical(text1, text2) {
        return text1 === text2;
    }

    function isSingleWord(text) {
        // matches if the entire text consists of unicode letters; nothing but letters allowed
        const regexp = /^\p{Letter}*$/u;
        return text.match(regexp);
    }

    /**
     * Compare a string against another.
     * 
     * Meant for checking if a user typed string matches the translation.
     * Possible outcomes are:
     * - typed string is a match, i.e. correct
     * - typed strings is a partial match (i.e. good enough, e.g. by being lenient towards uppercase)
     * - typed string is not a match, i.e. incorrect
     * 
     * @param {string} textToCompare - text to check
     * @param {string} targetText - the first string is being checked against this one
     * @returns - one of the resultCodes, or undefined
     * 
     * @example
     * compare('dag, -en', 'dag, -en') // identical (perfect match)
     * compare('fooäöü', 'fooäöübar') // noMatch (single word - must be identical to match, no partial match possible)
     */
    const compare = (textToCompare, targetText) => {
        if (typeof textToCompare !== 'string' || typeof targetText !== 'string') return;

        // trim whitespace
        const text1 = textToCompare.trim();
        const text2 = targetText.trim();

        if (!text1 || !text2) return;

        if (isIdentical(text1, text2)) {
            // Texts are identical.
            // example: compare('dag, -en', 'dag, -en')
            return resultCodes.IDENTICAL;
        }

        if (isSingleWord(text2)) {
            // The target text is a single word. There are no partial matches for this case. It's either
            // correct (covered by the 'isIdentical' check above) or incorrect.
            // example: compare('foo', 'foobar')
            return resultCodes.NO_MATCH;
        }

        return;
    };

    return {
        resultCodes,
        compare
    };
};
