/**
 * Add a writing exercise to the daily "blitz" vocab trainer
 */
const initVocabTrainerAddWriting = () => {
    const textComparisonHelper = textComparison();
    const exerciseElemClass = 'writing-exercise';
    let typedText = '';

    const getExerciseElem = () => {
        const inputElem = document.createElement('input');
        inputElem.type = 'text';
        inputElem.autocapitalize = 'off';
        inputElem.autocomplete = 'off';
        inputElem.classList.add('eingabezeile1');

        const submitElem = document.createElement('a');
        submitElem.textContent = 'Test';
        submitElem.classList.add('ctabutton', 'ctaklein2', 'eingabezeile2');

        // Clicking a button on the page programmatically doesn't work because that button's href calls a function in the 'main'
        // world which the 'isolated' extension doesn't have access to. But adding that same href function to an element works -_-
        // This href value is the same as the blue lightbulb button's.
        const translationButton = document.querySelector('a:has(> i.fa-stack > svg.svg-inline--fa.fa-lightbulb-on)');
        if (translationButton) {
            submitElem.href = translationButton.href;
        }

        const exerciseElem = document.createElement('div');
        exerciseElem.classList.add(exerciseElemClass);
        exerciseElem.append(inputElem);
        exerciseElem.append(submitElem);

        return exerciseElem;
    };

    const blurHandler = (event) => {
        typedText = event.target.value || '';
    };

    const doTheActualThing = () => {
        // Selects the vocabulary text container in the "blitz" trainer in the daily trainer.
        // Select only if no exercise element is there to avoid adding multiple ones (e.g. when other page changes trigger a mutation).
        const selectorDayTrainerSingleVocab = `#containerblitz .DivAutopilotText:not(:has(.${exerciseElemClass}))`;
        const elemsToExtend = document.querySelectorAll(`${selectorDayTrainerSingleVocab}`);

        elemsToExtend.forEach((elem) => {
            const germanTextElem = elem.querySelector('.DivAutopilotWort1');
            const l2TextElem = elem.querySelector('.DivAutopilotWort2');
            if (!germanTextElem) return;

            const exerciseElem = getExerciseElem();
            germanTextElem.append(exerciseElem);

            const inputElem = exerciseElem.querySelector('input');
            if (!inputElem) return;

            const l2Text = l2TextElem.textContent?.trim();

            if (l2Text?.length > 0) {
                // L2 text is visible. I.e. the DOM has been recreated and the input field with the user's typed text is replaced
                // with a new input field.

                // Add last typed text to the newly created input field, so that it can be checked against the L2 solution.
                inputElem.value = typedText;

                // hide the CTA because there's no need to click it again
                const cta = exerciseElem.querySelector('a');
                if (cta) {
                    cta.classList.add('hide');
                }

                // compare the typed text with the L2 translation
                const comparisonResult = textComparisonHelper.compare(typedText, l2Text);

                switch (comparisonResult) {
                    case textComparisonHelper.resultCodes.IDENTICAL:
                        inputElem.classList.add('correct');
                        break;
                    case textComparisonHelper.resultCodes.PARTIAL_MATCH:
                        inputElem.classList.add('partially-correct');
                        break;
                    case textComparisonHelper.resultCodes.NO_MATCH:
                        inputElem.classList.add('incorrect');
                        break;
                    default:
                        // do nothing
                }
            } else {
                // L2 is still hidden. Reset stored typed text to not show any previous input.
                typedText = '';
                // Listen to blur when user stopped typing to store the typed text.
                inputElem.addEventListener('blur', blurHandler);
            }
        });
    };

    const addVocabTrainerWritingInput = ({ observer, observerTargetNode, observerConfig }) => {
        // stop MutationObserver
        // Keeping it running while manipulating the DOM would cause an infinite loop.
        observer.disconnect();

        // separate function so that e.g. early returns are possible but the MutationObserver is always restarted
        doTheActualThing();

        // `doTheActualThing()` might mutate the DOM. Thus, we want to restart the MutationObserver AFTER all the DOM updates
        // have finished to prevent loops. To do so, we need two nested `requestAnimationFrame()` calls because this is called
        // BEFORE the next repaint.
        // I.e. this outer call fires before the next repaint
        requestAnimationFrame(() => {
            // fires before the _next_ next repaint
            // ...which is effectively _after_ the next repaint
            requestAnimationFrame(() => {
                // restart MutationObserver
                observer.observe(observerTargetNode, observerConfig);
            });
        });
    };

    return addVocabTrainerWritingInput;
};
