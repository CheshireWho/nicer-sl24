/**
 * Helper to compare texts
 */
const textComparison = () => {
    const resultCodes = {
        IDENTICAL: 'identical',
        PARTIAL_MATCH: 'partialMatch',
        NO_MATCH: 'noMatch'
    };

    function isIdentical(text1, text2) {
        return text1 === text2;
    }

    function isPartialMatch(text1, text2) {
        // TODO implement logic
        return false;
    }

    const compare = (text1, text2) => {
        if (typeof text1 !== 'string' || typeof text2 !== 'string') return;

        if (isIdentical(text1, text2)) {
            return resultCodes.IDENTICAL;
        }

        if (isPartialMatch(text1, text2)) {
            return resultCodes.PARTIAL_MATCH;
        }

        return resultCodes.NO_MATCH;
    };

    return {
        resultCodes,
        compare
    };
};
