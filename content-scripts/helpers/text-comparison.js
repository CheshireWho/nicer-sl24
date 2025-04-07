/**
 * Helper to compare texts
 * 
 * For reference on the RegExp snippets, see
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape
 * - https://unicode.org/reports/tr18/#General_Category_Property
 * - https://regex101.com/
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

    function isSentence(text) {
        // Matches if text starts with an uppercase letter, anything inbetween, and ends with punctuation.
        // Could also be multiple sentences.
        // Note that 'Punctuation' matches quite a lot.
        const regexp = /^\p{Uppercase_Letter}(.*)?\p{Punctuation}$/u;
        return text.match(regexp);
    }

    /**
     * @returns
     *   resultCodes.PARTIAL_MATCH - if the only potential differences between text1 and text2 are the first character being
     *                               lowercase/uppercase and the punctutation at the end (and only the end)
     *  resultCodes.NO_MATCH - otherwise
     * 
     * @example partial match: compareSentences("Lovely day, isn't it?", "lovely day, isn't it")
     * @example no match: compareSentences("Lovely day, isn't it?", "lovely day isnt it")
     */
    function compareSentences(text1, text2) {
        // make first character lowercase
        const text1StartLowercase = text1.charAt(0).toUpperCase() + text1.slice(1);
        const text2StartLowercase = text2.charAt(0).toUpperCase() + text2.slice(1);

        // remove any punctuation from the END (keep punctuation anywhere else)
        const regexpEndPunctuation = /\p{Punctuation}*$/u;
        const text1StartLowercaseNoEndPunctuation = text1StartLowercase.replace(regexpEndPunctuation, '');
        const text2StartLowercaseNoEndPunctuation = text2StartLowercase.replace(regexpEndPunctuation, '');

        return text1StartLowercaseNoEndPunctuation === text2StartLowercaseNoEndPunctuation ?
            resultCodes.PARTIAL_MATCH :
            resultCodes.NO_MATCH;
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
     * compare("lovely day, isn't it", "Lovely day, isn't it?") // partial match (sentence - first character case and
     *                                                             end punctuation ignored)
     * compare("lovely day isnt it", "Lovely day, isn't it?") // no match (sentence)
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

        if (isSentence(text2)) {
            // The target text is one or more sentences (as defined as starting with uppercase letter and ending with punctuation).
            // - 'Identical' case is covered above by the 'isIdentical' check.
            // - Can be partial match when typed text starts with lowercase and omits the ending (and only the ending!) punctuation.
            //   For quicker typing on virtual keyboards for short 'sentences' (e.g. 'Hvorfra?') while being strict on real sentences.
            // - Otherwise, it's not a match.
            // example partial match: compare("lovely day, isn't it", "Lovely day, isn't it?")
            // example no match: compare("lovely day isnt it", "Lovely day, isn't it?")
            return compareSentences(text1, text2);
        }

        // TODO the rest are 'lists' of words
        //  - enkelt, simpel
        //  - enkel,simpel
        //  - enkel / simpel
        //  - god(t)
        //  - gammel(t), gamle (pl.)
        //  - nat, -ten
        //  - nat,- ten
        //  - frokost, -en, middag, -en
        //  - museum, -et   // needs to match 'museum', 'museet', 'museum, museet' (Dansk only)
        //  - fersken, -en  // 'ferskenen' but with hint that it might be 'fersknen'. link to ordbog?? (Dansk only)

        return;
    };

    return {
        resultCodes,
        compare
    };
};
