/**
 * Add links to Google and Microsoft Translate
 */
const initTranslateLinkCreation = () => {
  const languages = {
    daenisch: 'da',
    japanisch: 'jp',
    schwedisch: 'sv',
  };

  // get learn language from URL
  const l2regexp = new RegExp(`(${Object.keys(languages).join('|')})`);
  // location.search is used for the login area, location.href for the bilingual stories
  const l2matches =
    window.location.search.toLowerCase().match(l2regexp) ?? window.location.href.toLowerCase().match(l2regexp);
  const l2 = l2matches?.[0];

  const translateLinksClass = 'translate-link-wrap';
  const translateLinkClass = 'translate-link';
  const googleTranslateLinkClass = 'google-translate';
  const microsoftTranslateLinkClass = 'microsoft-translate';
  const translateLinksNewElemWrapClass = 'translate-links-new-elem-wrap';
  const translateSourceLanguage = l2 && languages[l2] ? languages[l2] : 'auto';
  const translateTargetLanguage = 'de';

  // Once appended to an element, this node is 'used up'. So it needs to be created for each usage individually.
  const getTranslateSvgElem = () => {
    // Create the fontawesome SVG: https://fontawesome.com/icons/language?f=classic&s=solid
    // Using <i> with class names does not work for the bilingual stories because the required code isn't available there;
    // so an actual SVG is needed.
    const TranslateSvgWrap = document.createElement('div');
    TranslateSvgWrap.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="30"><path fill="currentColor" d="M0 128C0 92.7 28.7 64 64 64l192 0 48 0 16 0 256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64l-256 0-16 0-48 0L64 448c-35.3 0-64-28.7-64-64L0 128zm320 0l0 256 256 0 0-256-256 0zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-64 144c-4.5 10.1 .1 21.9 10.2 26.4s21.9-.1 26.4-10.2l8.9-20.1 73.6 0 8.9 20.1c4.5 10.1 16.3 14.6 26.4 10.2s14.6-16.3 10.2-26.4l-64-144zM160 233.2L179 276l-38 0 19-42.8zM448 164c11 0 20 9 20 20l0 4 44 0 16 0c11 0 20 9 20 20s-9 20-20 20l-2 0-1.6 4.5c-8.9 24.4-22.4 46.6-39.6 65.4c.9 .6 1.8 1.1 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.9 27.4s-18 12.5-27.4 6.9l-18.9-11.3c-4.5-2.7-8.8-5.5-13.1-8.5c-10.6 7.5-21.9 14-34 19.4l-3.6 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-6.1 18.5-9.8l-12.2-12.2c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l14.6 14.6 .5 .5c12.4-13.1 22.5-28.3 29.8-45L448 228l-72 0c-11 0-20-9-20-20s9-20 20-20l52 0 0-4c0-11 9-20 20-20z"/></svg>';

    return TranslateSvgWrap.children[0];
  };

  const getTranslateLinksElem = () => {
    // Create the fontawesome SVG: https://fontawesome.com/icons/language?f=classic&s=solid
    // Using <i> with class names does not work for the bilingual stories because the required code isn't available there;
    // so an actual SVG is needed.
    const GoogleSvgWrap = document.createElement('div');
    GoogleSvgWrap.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" width="8"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>';

    const MicrosoftSvgWrap = document.createElement('div');
    MicrosoftSvgWrap.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="8"><path fill="currentColor" d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"/></svg>';

    const TranslateLinksElem = document.createElement('div');
    TranslateLinksElem.classList.add(translateLinksClass);

    const GoogleTranslateLinkElem = document.createElement('a');
    GoogleTranslateLinkElem.classList.add(translateLinkClass, googleTranslateLinkClass);
    GoogleTranslateLinkElem.target = '_blank';
    GoogleTranslateLinkElem.appendChild(GoogleSvgWrap.children[0]);
    GoogleTranslateLinkElem.appendChild(getTranslateSvgElem());

    const MicrosoftTranslateLinkElem = document.createElement('a');
    MicrosoftTranslateLinkElem.classList.add(translateLinkClass, microsoftTranslateLinkClass);
    MicrosoftTranslateLinkElem.target = '_blank';
    MicrosoftTranslateLinkElem.appendChild(MicrosoftSvgWrap.children[0]);
    MicrosoftTranslateLinkElem.appendChild(getTranslateSvgElem());

    TranslateLinksElem.appendChild(GoogleTranslateLinkElem);
    TranslateLinksElem.appendChild(MicrosoftTranslateLinkElem);

    return TranslateLinksElem;
  };

  const translateClickHandler = (event) => {
    const Link = event.target?.closest(`.${translateLinkClass}`);
    let textToTranslate;

    if (Link?.classList.contains('daily-single-convo-trainer')) {
      // this link is in the daily trainer's single item conversation trainer
      textToTranslate = Link.closest(`.${translateLinksClass}`).parentElement.childNodes[0].textContent;
    } else if (Link?.classList.contains('daily-sieben-trainer')) {
      // this link is one item in the daily trainer's table trainer (e.g., conversion trainer with multiple items, or dialogue trainer)
      textToTranslate = Link.closest('td').previousElementSibling?.textContent;
    } else if (Link?.classList.contains('daily-sieben-trainer-entire-text')) {
      // this link is right after the daily trainer's table trainer (e.g., conversion trainer with multiple items, or dialogue trainer)
      const sentences = [];

      const learnLanguageCells = Link.closest(`.${translateLinksNewElemWrapClass}`).previousElementSibling?.querySelectorAll(
        'td.siebentd:has(+ td:not(.siebentd))'
      );

      // collect the text of all the items in the table
      learnLanguageCells?.forEach((cell) => {
        const cellText = cell.textContent?.trim();
        if (cellText) {
          sentences.push(cellText);
        }
      });

      textToTranslate = sentences.join(' ');
    } else if (Link?.classList.contains('verb-trainer')) {
      // this link is in the verb trainer
      textToTranslate = Link?.closest(`.${translateLinksClass}`).parentElement.textContent?.trim();
    } else if (Link?.classList.contains('bilingual-stories-single-item')) {
      // this link is a single item in the bilingual stories
      textToTranslate = Link?.closest(`.${translateLinksClass}`)
        .parentElement.querySelector('.div_td:nth-child(2)')
        ?.textContent?.trim();
    } else if (Link?.classList.contains('bilingual-stories-story-heading-item')) {
      // this link is a story heading item in the bilingual stories
      const sentences = [];

      // add the story heading L2 text for the translate link
      const headingL2Text = `${Link?.closest(`.${translateLinksClass}`)
        .parentElement.querySelector('.LANGX1')
        ?.textContent?.trim()}.`;
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
      if (Link.classList.contains(googleTranslateLinkClass)) {
        Link.href = `https://translate.google.com/?sl=${translateSourceLanguage}&tl=${translateTargetLanguage}&op=translate&text=${encodeURI(
          textToTranslate
        )}`;
      } else {
        Link.href = `https://www.bing.com/translator?from=${translateSourceLanguage}&to=${translateTargetLanguage}&text=${encodeURI(
          textToTranslate
        )}`;
      }
    }
  };

  /**
   * Add a translate link box to each selector match.
   * Add the className to the link for easy distinguishing
   *
   * @param {string} selector - selector for all elements that will get translate links
   * @param {string} className - class name that will be added to each translate link
   * @param {string} [newElemNodeName] - If set, a new element of the given node name is created. That element is inserted into the DOM
   *        right AFTER the given selector. This newly created element is the one that gets the translate links appended.
   */
  const appendTranslateLink = (selector, className, newElemNodeName = undefined) => {
    const elemsToGetLink = document.querySelectorAll(selector);

    elemsToGetLink.forEach((elem) => {
      const TranslateLinksElem = getTranslateLinksElem();
      let elemToGetLink;

      if (newElemNodeName) {
        const newElem = document.createElement(newElemNodeName);
        newElem.classList.add(translateLinksNewElemWrapClass);

        elem.after(newElem);
        elemToGetLink = newElem;
      } else {
        elemToGetLink = elem;
      }

      elemToGetLink.appendChild(TranslateLinksElem);

      const translateLinkElems = TranslateLinksElem.querySelectorAll('a');
      translateLinkElems.forEach((translateLink) => {
        translateLink.classList.add(className);
        translateLink.addEventListener('click', translateClickHandler);
      });
    });
  };

  const doTheActualThing = () => {
    if (window.location.host.includes('sprachenlernen24-onlinekurs')) {
      // Selects the L2 cells of the verb trainer that don't have a Translate link.
      // Select only if no translate link is there to avoid adding multiple links (e.g. when other page changes trigger a mutation).
      const selectorVerbTrainer = `.verbzelletd:nth-child(2):not(:has(.${translateLinkClass}))`;
      appendTranslateLink(selectorVerbTrainer, 'verb-trainer');

      // Selects the L2 element in the conversation trainer within the daily trainer (the one with single items and an image).
      // Select only if no translate link is there to avoid adding multiple links (e.g. when other page changes trigger a mutation).
      const selectorDailySingleConvoTrainer = `.Konvcontainer #KonvLoesung2:not(:has(.${translateLinkClass}))`;
      appendTranslateLink(selectorDailySingleConvoTrainer, 'daily-single-convo-trainer');

      // Selects the third column cell in the table trainer within the daily trainer (e.g. the conversation trainer with the
      // table of all the items for the current lesson, or the dialogue trainer).
      // Select only if no translate link is there to avoid adding multiple links (e.g. when other page changes trigger a mutation).
      const selectorDailySiebenTrainer = `#Blitzwdh3_Mitte tr td.siebentd ~ td:not(.siebentd):not(:has(.${translateLinkClass}))`;
      appendTranslateLink(selectorDailySiebenTrainer, 'daily-sieben-trainer');

      // Selects the entire table of the conversation / dialogue trainer within the daily trainer (i.e., the table with all the items for the
      // current lesson) to add translate links for the entire text and not just the individual items.
      // Select only if no translate link is there to avoid adding multiple links (e.g. when other page changes trigger a mutation).
      const selectorDailySiebenTrainerTable = `#Blitzwdh3_Mitte table:has(td.siebentd):not(:has(+ div.${translateLinksNewElemWrapClass})`;
      appendTranslateLink(selectorDailySiebenTrainerTable, 'daily-sieben-trainer-entire-text', 'div');
    } else if (window.location.href.includes('zweisprachige-geschichten')) {
      // Selects the single sentences in bilingual stories.
      // Select only if no translate link is there to avoid adding multiple links (e.g. when other page changes trigger a mutation).
      const selectorBilingualStoriesSingleL2Item = `.LANG1:not(:has(.${translateLinkClass}))`;
      appendTranslateLink(selectorBilingualStoriesSingleL2Item, 'bilingual-stories-single-item');

      // Selects the story heading in bilingual stories.
      // Select only if no translate link is there to avoid adding multiple links (e.g. when other page changes trigger a mutation).
      const selectorBilingualStoriesStoryHeadingItem = `.TITLES .TITLESINNER:not(:has(.${translateLinkClass}))`;
      appendTranslateLink(selectorBilingualStoriesStoryHeadingItem, 'bilingual-stories-story-heading-item');
    }
  };

  const addTranslateLink = ({ observer, observerTargetNode, observerConfig }) => {
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

  return addTranslateLink;
};
