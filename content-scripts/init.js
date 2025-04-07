/**
 * Start the whole thing
 */
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