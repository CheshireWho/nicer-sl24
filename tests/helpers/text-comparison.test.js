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
}
console.groupEnd();
