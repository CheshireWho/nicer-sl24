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
        let textToTranslate;

        if (Link?.parentElement.id === 'KonvLoesung2') {
            // this link is in the daily trainer's conversation trainer
            textToTranslate = Link.parentElement.childNodes[0].textContent;
        } else {
            // this link is in the verb trainer
            textToTranslate = Link?.parentElement.textContent?.trim();
        }
        
        if (Link && textToTranslate) {
            Link.href = `https://translate.google.com/?sl=${gTSourceLanguage}&tl=${gTTargetLanguage}&op=translate&text=${encodeURI(textToTranslate)}`;
        }
    };

    const doTheActualThing = () => {
        // selects the L2 cells of the verb trainer that don't have a Google Translate link
        const selectorVerbTrainer = `.verbzelletd:nth-child(2):not(:has(.${gTLinkClass}))`;
        // selects the L2 element in the conversation trainer within the daily trainer (the one with single items and an image)
        const selectorDailyConvoTrainer = '.Konvcontainer #KonvLoesung2';

        const elemsToGetLink = document.querySelectorAll(`${selectorVerbTrainer}, ${selectorDailyConvoTrainer}`);

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

    return addGoogleTranslateLink;
};
