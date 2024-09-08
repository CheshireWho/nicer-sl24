/**
 * Add a link to Google Translate
 */
const initGoogleTranslateLinkCreation = () => {
    const languages = {
        'daenisch': 'da',
        'japanisch': 'jp',
        'schwedisch': 'sv'
    };

    // get learn language from URL
    const l2regexp = new RegExp(`(${Object.keys(languages).join('|')})`);
    // location.search is used for the login area, location.href for the bilingual stories
    const l2matches = window.location.search.toLowerCase().match(l2regexp) ?? window.location.href.toLowerCase().match(l2regexp);
    const l2 = l2matches?.[0];
    
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

        if (Link?.classList.contains('daily-convo-trainer')) {
            // this link is in the daily trainer's conversation trainer
            textToTranslate = Link.parentElement.childNodes[0].textContent;
        } else if (Link?.classList.contains('verb-trainer')) {
            // this link is in the verb trainer
            textToTranslate = Link?.parentElement.textContent?.trim();
        } else if (Link?.classList.contains('bilingual-stories-single-item')) {
            // this link is a single item in the bilingual stories
            textToTranslate = Link?.parentElement.querySelector('.div_td:nth-child(2)')?.textContent?.trim();
        }
        
        if (Link && textToTranslate) {
            Link.href = `https://translate.google.com/?sl=${gTSourceLanguage}&tl=${gTTargetLanguage}&op=translate&text=${encodeURI(textToTranslate)}`;
        }
    };

    // Add a GT link to each selector match.
    // Add the className to the link for easy distinguishing
    const appendGtLink = (selector, className) => {
        const elemsToGetLink = document.querySelectorAll(selector);

        elemsToGetLink.forEach((elem) => {
            const GTLinkElem = getGTLinkElem();
            GTLinkElem.classList.add(className);
            elem.appendChild(GTLinkElem);

            GTLinkElem.addEventListener('click', gTClickHandler);
        });
    };

    const doTheActualThing = () => {
        if (window.location.host.includes('sprachenlernen24-onlinekurse')) {
            // Selects the L2 cells of the verb trainer that don't have a Google Translate link.
            // Select only if no GT link is there to avoid adding multiple links (e.g. when other page changes trigger a mutation).
            const selectorVerbTrainer = `.verbzelletd:nth-child(2):not(:has(.${gTLinkClass}))`;
            appendGtLink(selectorVerbTrainer, 'verb-trainer');

            // Selects the L2 element in the conversation trainer within the daily trainer (the one with single items and an image).
            // Select only if no GT link is there to avoid adding multiple links (e.g. when other page changes trigger a mutation).
            const selectorDailyConvoTrainer = `.Konvcontainer #KonvLoesung2:not(:has(.${gTLinkClass}))`;
            appendGtLink(selectorDailyConvoTrainer, 'daily-convo-trainer');
        } else if (window.location.href.includes('zweisprachige-geschichten')) {
            const selectorBilingualStoriesSingleL2Item = `.LANG1:not(:has(.${gTLinkClass}))`;
            appendGtLink(selectorBilingualStoriesSingleL2Item, 'bilingual-stories-single-item');

        }
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
