const initGoogleTranslateLinkCreation = () => {
    const gTLinkClass = 'gt-link';
    const gTSourceLanguage = 'da'; // TODO make dynamic
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

(function() {
    // `addGoogleTranslateLink` is called often, but the other init code is called only once for performance
    const addGoogleTranslateLink = initGoogleTranslateLinkCreation();

    const init = () => {
		const observerTargetNode = document.body;
		// Making changes to the DOM triggers a mutation. I.e. it's easy to create an infinite loop!
        // To avoid that, either set the corresponding option here to `false`, or disconnent the observer
        // before making any DOM changes and then re-connect.
		const observerConfig = { attributes: false, childList: true, subtree: true };
		const mutationsCallback = (mutationsList, observer) => {
            console.log('MutationObserver callback triggered');
			addGoogleTranslateLink({ observer, observerTargetNode, observerConfig });
		};
		const observer = new MutationObserver(mutationsCallback);
		observer.observe(observerTargetNode, observerConfig);
	};

    init();
})();