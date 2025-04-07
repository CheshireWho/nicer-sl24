/**
 * Add a writing exercise to the daily "blitz" vocab trainer
 */
const initVocabTrainerAddWriting = () => {
    const inputClass = 'writing-exercise';
    let typedText = '';

    const getInputElem = () => {
        const inputElem = document.createElement('input');
        inputElem.type = 'text';
        inputElem.autocapitalize = 'off';
        inputElem.autocomplete = 'off';
        inputElem.classList.add('eingabezeile1');
        inputElem.classList.add(inputClass);

        return inputElem;
    };

    const blurHandler = (event) => {
        typedText = event.target.value || '';
    };

    const addVocabTrainerWritingInput = ({ observer, observerTargetNode, observerConfig }) => {
        // stop MutationObserver
        // Keeping it running while manipulating the DOM would cause an infinite loop.
        observer.disconnect();

        // selects the vocabulary text container in the "blitz" trainer in the daily trainer
        const selectorDayTrainerSingleVocab = `#containerblitz .DivAutopilotText:not(:has(.${inputClass}))`;
        const elemsToExtend = document.querySelectorAll(`${selectorDayTrainerSingleVocab}`);

        elemsToExtend.forEach((elem) => {
            const germanTextElem = elem.querySelector('.DivAutopilotWort1');
            const l2TextElem = elem.querySelector('.DivAutopilotWort2');
            if (!germanTextElem) return;

            const inputElem = getInputElem();
            germanTextElem.appendChild(inputElem);

            const l2Text = l2TextElem.textContent?.trim();

            if (l2Text?.length > 0) {
                // L2 text is visible. I.e. the DOM has been recreated and the input field with the user's typed text is replaced with a new input field.
                // Add last typed text to the newly created input field, so that it can be checked against the L2 solution.
                inputElem.value = typedText;

                if (typedText === l2Text) {
                    inputElem.classList.add('correct');
                }
            } else {
                // L2 is still hidden. Reset stored typed text to not show any previous input.
                typedText = '';
                // Listen to blur when user stopped typing to store the typed text.
                inputElem.addEventListener('blur', blurHandler);
            }
        });

        // restart MutationObserver
        observer.observe(observerTargetNode, observerConfig);
    };

    return addVocabTrainerWritingInput;
};
