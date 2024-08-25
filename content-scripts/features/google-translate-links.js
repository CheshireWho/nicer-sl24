/**
 * Add a link to Google Translate
 */
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

    const doTheActualThing = () => {
        // selects the L2 cells of the verb trainer that don't have a Google Translate link
        const selectorVerbTrainer = `.verbzelletd:nth-child(2):not(:has(.${gTLinkClass}))`;
        const elemsToGetLink = document.querySelectorAll(`${selectorVerbTrainer}`);

        elemsToGetLink.forEach((elem) => {
            const GTLinkElem = getGTLinkElem();
            elem.appendChild(GTLinkElem);

            GTLinkElem.addEventListener('click', gTClickHandler);
        });
    };

    const addGoogleTranslateLink = ({ observer, observerTargetNode, observerConfig }) => {
        // stop MutationObserver
        // Keeping it running while manipulating the DOM would cause an infinite loop.
        observer.disconnect();

        // separate function so that e.g. early returns are possible but the MutationObserver is always restarted
        doTheActualThing();

        // restart MutationObserver
        observer.observe(observerTargetNode, observerConfig);
    };

    return addGoogleTranslateLink;
};
