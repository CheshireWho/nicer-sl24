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
        // Create the fontawesome SVG: https://fontawesome.com/icons/language?f=classic&s=solid
        // Using <i> with class names does not work for the bilingual stories because the required code isn't available there;
        // so an actual SVG is needed.
        const SvgWrap = document.createElement('div');
        SvgWrap.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="30"><path fill="currentColor" d="M0 128C0 92.7 28.7 64 64 64l192 0 48 0 16 0 256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64l-256 0-16 0-48 0L64 448c-35.3 0-64-28.7-64-64L0 128zm320 0l0 256 256 0 0-256-256 0zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-64 144c-4.5 10.1 .1 21.9 10.2 26.4s21.9-.1 26.4-10.2l8.9-20.1 73.6 0 8.9 20.1c4.5 10.1 16.3 14.6 26.4 10.2s14.6-16.3 10.2-26.4l-64-144zM160 233.2L179 276l-38 0 19-42.8zM448 164c11 0 20 9 20 20l0 4 44 0 16 0c11 0 20 9 20 20s-9 20-20 20l-2 0-1.6 4.5c-8.9 24.4-22.4 46.6-39.6 65.4c.9 .6 1.8 1.1 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.9 27.4s-18 12.5-27.4 6.9l-18.9-11.3c-4.5-2.7-8.8-5.5-13.1-8.5c-10.6 7.5-21.9 14-34 19.4l-3.6 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-6.1 18.5-9.8l-12.2-12.2c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l14.6 14.6 .5 .5c12.4-13.1 22.5-28.3 29.8-45L448 228l-72 0c-11 0-20-9-20-20s9-20 20-20l52 0 0-4c0-11 9-20 20-20z"/></svg>';

        const GTLinkElem = document.createElement('a');
        GTLinkElem.classList.add(gTLinkClass);
        GTLinkElem.target = '_blank';
        GTLinkElem.appendChild(SvgWrap.children[0]);

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
        } else if (Link?.classList.contains('bilingual-stories-story-heading-item')) {
            // this link is a story heading item in the bilingual stories
            const sentences = [];

            // add the story heading L2 text for the GT link
            const headingL2Text = `${Link?.parentElement.querySelector('.LANGX1')?.textContent?.trim()}.`;
            sentences.push(headingL2Text);

            let currentElement = Link?.closest('.TITLES');

            // loop only as long as there are next sibling elements
            while (currentElement.nextElementSibling) {
                currentElement = currentElement.nextElementSibling;

                // if the next sibling element is not the L1 or L2 text for this story, break the loop, i.e. story ending reached
                if (!currentElement.classList.contains('LANG1') && !currentElement.classList.contains('LANG2')) {
                    break;
                }

                if (currentElement.classList.contains('LANG1')) {
                    // This is an L2 text of this specific story. Add it to the GT link.
                    const l2Text = currentElement.querySelector('.div_td:nth-child(2)')?.textContent?.trim();
                    sentences.push(l2Text);
                }
            }

            textToTranslate = sentences.join(' ');
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
            // Selects the single sentences in bilingual stories.
            // Select only if no GT link is there to avoid adding multiple links (e.g. when other page changes trigger a mutation).
            const selectorBilingualStoriesSingleL2Item = `.LANG1:not(:has(.${gTLinkClass}))`;
            appendGtLink(selectorBilingualStoriesSingleL2Item, 'bilingual-stories-single-item');

            // Selects the story heading in bilingual stories.
            // Select only if no GT link is there to avoid adding multiple links (e.g. when other page changes trigger a mutation).
            const selectorBilingualStoriesStoryHeadingItem = `.TITLES .TITLESINNER:not(:has(.${gTLinkClass}))`;
            appendGtLink(selectorBilingualStoriesStoryHeadingItem, 'bilingual-stories-story-heading-item');
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
