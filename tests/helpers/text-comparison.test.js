/**
 * INSTRUCTIONS:
 * In '../../content-scripts/helpers/text-comparison', uncomment the `globalThis` line at the very end.
 */

require('../../content-scripts/helpers/text-comparison');

const { compare } = textComparison();

const IDENTICAL = 'identical';
const PARTIAL_MATCH = 'partialMatch';
const NO_MATCH = 'noMatch';

console.group('textComparison helper #compare');
{
    console.group('when given params are not valid strings');
    {
        console.group('returns "undefined"');
        {
            console.assert(compare('foo', '') === undefined);
            console.assert(compare(' ', '   ') === undefined);
            console.assert(compare(3, 'foo') === undefined);
        }
        console.groupEnd();
    }
    console.groupEnd();

    console.group('when strings are identical');
    {
        console.group(`returns "${IDENTICAL}"`);
        {
            console.assert(compare('tak', 'tak') === IDENTICAL);
            console.assert(compare('tak ', ' tak') === IDENTICAL);
            console.assert(compare('Hvorfra?', 'Hvorfra?') === IDENTICAL);
            console.assert(compare('dag, -en', 'dag, -en') === IDENTICAL);
            console.assert(compare('at lave', 'at lave') === IDENTICAL);
        }
        console.groupEnd();
    }
    console.groupEnd();

    console.group('when the target text ends with " (pl.)"');
    {
        console.group('and the text to compare does not');
        {
            console.group(`returns "${IDENTICAL}" if the strings are otherwise identical`);
            {
                console.assert(compare('de her', 'de her (pl.)') === IDENTICAL);
            }
            console.groupEnd();
        }
        console.groupEnd();
    }
    console.groupEnd();

    console.group('when the target text is a single word');
    {
        console.group(`returns "${IDENTICAL}" if the given words are identical`);
        {
            console.assert(compare('godaften', 'godaften') === IDENTICAL);
            console.assert(compare('godmorgen ', ' godmorgen') === IDENTICAL);
        }
        console.groupEnd();

        console.group(`returns "${NO_MATCH}" if the given words are not identical`);
        {
            console.assert(compare('godaften', 'godmorgen') === NO_MATCH);
        }
        console.groupEnd();
    }
    console.groupEnd();

    console.group('when the target text is a sentence');
    {
        console.group(`returns "${PARTIAL_MATCH}" if the first letter's case is different`);
        {
            console.assert(compare("lovely day, isn't it?", "Lovely day, isn't it?") === PARTIAL_MATCH);
        }
        console.groupEnd();

        console.group(`returns "${PARTIAL_MATCH}" if the punctuation at the end is different`);
        {
            console.assert(compare("Lovely day, isn't it", "Lovely day, isn't it?") === PARTIAL_MATCH);
            console.assert(compare("undskyld", "Undskyld, ...") === PARTIAL_MATCH);
        }
        console.groupEnd();

        console.group(`returns "${NO_MATCH}" if punctuation in the middle of the sentence doesn't match`);
        {
            console.assert(compare("Lovely day isnt it?", "Lovely day, isn't it?") === NO_MATCH);
        }
        console.groupEnd();

        console.group(`returns "${NO_MATCH}" if letter case in the middle of the sentence doesn't match`);
        {
            console.assert(compare("Lovely Day isn't it?", "Lovely day, isn't it?") === NO_MATCH);
        }
        console.groupEnd();

        console.group(`returns "${NO_MATCH}" if spelling is incorrect`);
        {
            console.assert(compare("Lovly day, isn't it?", "Lovely day, isn't it?") === NO_MATCH);
        }
        console.groupEnd();
    }
    console.groupEnd();

    console.group('when the target text is a list of one or more phrases');
    {
        console.group(`returns "${IDENTICAL}" if both texts' lists contain the same phrases`);
        {
            console.assert(compare("at spille, at lege", "at lege, at spille") === IDENTICAL);
            console.assert(compare("at spille, at lege", "at lege,at spille") === IDENTICAL);
            console.assert(compare("at spille, at lege", "at lege / at spille") === IDENTICAL);
        }
        console.groupEnd();

        console.group(`returns "${NO_MATCH}" if the typed text contains more phrases than the target text`);
        {
            console.assert(compare("foo, bar, baz", "foo, bar") === NO_MATCH);
        }
        console.groupEnd();

        console.group(`returns "${PARTIAL_MATCH}" if the typed text's phrases are part of the target text, but the target text has some additional phrases`);
        {
            console.assert(compare("bar, foo", "foo, bar, baz") === PARTIAL_MATCH);
        }
        console.groupEnd();

        console.group('and any target text item has alternative forms in parentheses');
        {
            console.group('treats each possible form as a target item');
            {
                console.assert(compare('god, godt', 'god(t)') === IDENTICAL);
                console.assert(compare('gammel, gammelt, gamle', 'gammel(t), gamle (pl.)') === IDENTICAL);
                console.assert(compare('gammel, gamle', 'gammel(t), gamle (pl.)') === PARTIAL_MATCH);
            }
            console.groupEnd();
        }
        console.groupEnd();

        console.group('and any target text item is a suffix indicated by a hyphen');
        {
            console.group('and the suffix has not more than 3 characters');
            {
                console.group('expects the complete phrase, i.e. base form + suffix');
                {
                    console.assert(compare('nat, natten', 'nat, -ten') === IDENTICAL);
                    console.assert(compare('frokost, frokosten, middag, middagen', 'frokost, - en, middag, -en') === IDENTICAL);
                    console.assert(compare('middag, frokosten', 'frokost, - en, middag, -en') === PARTIAL_MATCH);
                }
                console.groupEnd();
            }
            console.groupEnd();

            console.group('and the suffix ends with "dlen" and the base form with "ddel"');
            {
                console.group('expects the correct complete phrase, i.e. base form with "dlen"');
                {
                    console.assert(compare('pengeseddel, pengesedlen', 'pengeseddel, -sedlen') === IDENTICAL);
                    console.assert(compare('vaskemiddel, vaskemidlen', 'vaskemiddel, -midlen') === IDENTICAL);
                }
                console.groupEnd();
            }
            console.groupEnd();
        }
        console.groupEnd();
    }
    console.groupEnd();
}
console.groupEnd();
