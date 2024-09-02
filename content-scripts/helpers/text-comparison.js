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
     *  resultCodes.PARTIAL_MATCH - if the only potential differences between text1 and text2 are the first character being
     *                              lowercase/uppercase and the punctutation at the end (and only the end)
     *  resultCodes.NO_MATCH - otherwise
     * 
     * @example partial match: compareSentences("lovely day, isn't it", "Lovely day, isn't it?")
     * @example partial match: compareSentences("undskyld", "Undskyld, ...")
     * @example no match: compareSentences("lovely day isnt it", "Lovely day, isn't it?")
     */
    function compareSentences(text1, text2) {
        // make first character lowercase
        const text1StartLowercase = text1.charAt(0).toUpperCase() + text1.slice(1);
        const text2StartLowercase = text2.charAt(0).toUpperCase() + text2.slice(1);

        // remove any punctuation and spacing from the END (keep punctuation anywhere else)
        const regexpEndPunctuation = /(\p{Punctuation}|\s)*$/u;
        const text1StartLowercaseNoEndPunctuation = text1StartLowercase.replace(regexpEndPunctuation, '');
        const text2StartLowercaseNoEndPunctuation = text2StartLowercase.replace(regexpEndPunctuation, '');

        return text1StartLowercaseNoEndPunctuation === text2StartLowercaseNoEndPunctuation ?
            resultCodes.PARTIAL_MATCH :
            resultCodes.NO_MATCH;
    }

    /**
     * @param {Array} arr1 - array items to check
     * @param {Array} arr2 - target array items to compare the first one against
     * @returns
     *  resultCodes.IDENTICAL - if arr1 and arr2 contain the exact same items, but the order might be different
     *  resultCodes.PARTIAL_MATCH - if all arr1 items are part of arr2, but arr2 has more items
     *  resultCodes.NO_MATCH - if arr1 contains at least one item that's not part of arr2 (e.g. spelling mistake)
     * 
     * @example identical: compareArrays(['at spille', 'at lege'], ['at lege', 'at spille'])
     * @example identical: compareArrays(['god', 'godt'], ['god(t)']) // splits all forms in parentheses
     * @example partial match: compareArrays(['bar', 'foo'], ['foo', 'bar', 'baz']) // all arr1 items are in arr2
     * @example partial match: compareArrays(['gamle', 'gammelt'], ['gammel(t)', 'gamle'])
     * @example no match: compareArrays(['foo', 'bar', 'baz'], ['foo', 'bar']) // too many items in arr1
     */
    function compareArrays(arr1, arr2) {
        const arr2Prepared = [];

        arr2.forEach((targetItem) => {
            // matches items made of letters with parentheses around letters at the very end, e.g. 'gammel(t)'
            const regexpParentheses = /(\p{Letter}*)?\((\p{Letter}*)\)$/u;
            const parenthesesMatches = targetItem.match(regexpParentheses);

            if (parenthesesMatches) {
                // The item has optional additional letters, e.g. 'gammel(t)'.
                // To avoid having to type the parentheses and instead allow typing the actually correct phrases, split these
                // items into all possible correct forms, i.e. 'gammel' and 'gammelt'.
                // IMPORTANT: this means that typing the parenthses is no longer treated as being correct!

                // add the main phrase, e.g. 'gammel' (i.e. the first matching group)
                arr2Prepared.push(parenthesesMatches[1]);
                // add the secondary phrase, e.g. 'gammelt'
                arr2Prepared.push(`${parenthesesMatches[1]}${parenthesesMatches[2]}`);
            } else {
                arr2Prepared.push(targetItem);
            }

            // TODO more cases
            //  - nat, -ten
            //  - nat,- ten
            //  - frokost, -en, middag, -en
            //  - museum, -et   // needs to match 'museum', 'museet', 'museum, museet' (Dansk only)
            //  - fersken, -en  // 'ferskenen' but with hint that it might be 'fersknen'. link to ordbog?? (Dansk only)
        });

        const set1 = new Set(arr1);
        const set2 = new Set(arr2Prepared);

        if (set1.size > set2.size) {
            // arr1 has more items than arr2, so something's incorrect
            return resultCodes.NO_MATCH;
        }

        const intersection = set1.intersection(set2);

        if (intersection.size > 0 && intersection.size === set1.size && intersection.size === set2.size) {
            // arr1 and arr2 are identical, only the order might be different
            return resultCodes.IDENTICAL;
        }

        if (set1.isSubsetOf(set2)) {
            // all items of set1 are in set2; i.e. all set1 items are spelled correctly but set2 has some more items
            return resultCodes.PARTIAL_MATCH;
        }

        // TODO no match if any item of set1 is NOT in set2 (i.e. a typo / mistake)
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
     * compare('de her', 'de her (pl.)') // identical (' (pl.)' at the end is ignored)
     * compare('fooäöü', 'fooäöübar') // noMatch (single word - must be identical to match, no partial match possible)
     * compare("lovely day, isn't it", "Lovely day, isn't it?") // partial match (sentence - first character case and
     *                                                             end punctuation ignored)
     * compare("lovely day isnt it", "Lovely day, isn't it?") // no match (sentence)
     * compare('at spille, at lege', 'at lege, at spille') // identical (list of phrases, items are complete match)
     * compare('at spille, at lege', 'at lege / at spille') // identical (list of phrases, items are complete match)
     * compare('bar, foo', 'foo, bar, baz') // partial match (list of phrases; all items to compare are correct, but the target text
     *                                         has some more items)
     * compare('foo, bar, baz', 'foo, bar') // no match (list of phrases; text to compare has too many items, so at least one
     *                                         is incorrect)
     * compare('gammel, gammelt, gamle', 'gammel(t), gamle (pl.)') // identical (list of phrases; different forms in parentheses are
     *                                                                treated individually)
     */
    const compare = (textToCompare, targetText) => {
        if (typeof textToCompare !== 'string' || typeof targetText !== 'string') return;

        // trim whitespace
        const text1 = textToCompare.trim();
        const targetTextTrimmed = targetText.trim();

        // remove the literal string ' (pl.)' from the end of the text
        // to cover e.g. compare('de her', 'de her (pl.)')
        const regexpEndPlural = / \(pl\.\)$/;
        const text2 = targetTextTrimmed.replace(regexpEndPlural, '');

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

        // The strings are now lists of phrases with one or more items. So split them to compare the items.
        // e.g. 'foo, bar', 'foo,bar' --> ['foo', 'bar']
        const text1Pieces = text1.split(',').map((item) => item.trim());
        // some target texts use '/' as delimiter instead of ',', e.g. 'foo, bar', 'foo,bar', 'foo / bar' --> ['foo', 'bar']
        const text2Pieces = text2.split(/[,/]/).map((item) => item.trim());

        if (text1Pieces.length > 0 && text2Pieces.length > 0) {
            return compareArrays(text1Pieces, text2Pieces);
        }

        return;
    };

    return {
        resultCodes,
        compare
    };
};

// uncomment before running the tests
// globalThis.textComparison = textComparison;
