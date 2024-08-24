const initGoogleTranslateLinkCreation = () => {
    const languages = {
        'Daenisch': 'da',
        'Japanisch': 'jp',
        'Schwedisch': 'sv'
    };

    // get learn language from URL
    const l2regexp = new RegExp(`(${Object.keys(languages).join('|')})`);
    const l2matches = window.location.search.match(l2regexp);
    const l2 = l2matches[0];
    
    const gTLinkClass = 'gt-link';
    const gTSourceLanguage = l2 && languages[l2] ? languages[l2] : 'auto';
    const gTTargetLanguage = 'de';

    const getGTLinkElem = () => {
        const Icon = document.createElement('i');
        Icon.classList.add('fa-solid', 'fa-language');
        const GTLinkElem = document.createElement('a');
        GTLinkElem.classList.add(gTLinkClass);
        GTLinkElem.target = '_blank';
        GTLinkElem.appendChild(Icon);

        return GTLinkElem;
    };

    const gTClickHandler = (event) => {
        const Link = event.target?.closest(`.${gTLinkClass}`);
        const textToTranslate = Link?.parentElement.textContent?.trim();
        
        if (Link && textToTranslate) {
            Link.href = `https://translate.google.com/?sl=${gTSourceLanguage}&tl=${gTTargetLanguage}&op=translate&text=${encodeURI(textToTranslate)}`;
        }
    };

    const addGoogleTranslateLink = ({ observer, observerTargetNode, observerConfig }) => {
        // stop MutationObserver
        // Keeping it running while manipulating the DOM would cause an infinite loop.
        observer.disconnect();

        // selects the L2 cells of the verb trainer that don't have a Google Translate link
        const selectorVerbTrainer = `.verbzelletd:nth-child(2):not(:has(.${gTLinkClass}))`;
        const elemsToGetLink = document.querySelectorAll(`${selectorVerbTrainer}`);

        elemsToGetLink.forEach((elem) => {
            const GTLinkElem = getGTLinkElem();
            elem.appendChild(GTLinkElem);

            GTLinkElem.addEventListener('click', gTClickHandler);
        });

        // restart MutationObserver
        observer.observe(observerTargetNode, observerConfig);
    };

    return addGoogleTranslateLink;
};

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

(function() {
    // the returned functions are called often, but the other init code is called only once for performance
    const addGoogleTranslateLink = initGoogleTranslateLinkCreation();
    const addVocabTrainerWritingInput = initVocabTrainerAddWriting();

    const init = () => {
		const observerTargetNode = document.body;
		// Making changes to the DOM triggers a mutation. I.e. it's easy to create an infinite loop!
        // To avoid that, either set the corresponding option here to `false`, or disconnent the observer
        // before making any DOM changes and then re-connect.
		const observerConfig = { attributes: false, childList: true, subtree: true };
		const mutationsCallback = (mutationsList, observer) => {
			addGoogleTranslateLink({ observer, observerTargetNode, observerConfig });
			addVocabTrainerWritingInput({ observer, observerTargetNode, observerConfig });
		};
		const observer = new MutationObserver(mutationsCallback);
		observer.observe(observerTargetNode, observerConfig);

        // On narrow mobile, the MutationObserver is not triggered on page load in the regular verb trainer.
        // Thus, call it on page load.
        addGoogleTranslateLink({ observer, observerTargetNode, observerConfig });
	};

    init();
})();