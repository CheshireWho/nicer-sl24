(async function() {
    const addGoogleTranslateLink = () => {
        const linkClass = 'gt-link';
        const sourceLanguage = 'da'; // TODO make dynamic
        const targetLanguage = 'de';


        const clickHandler = (event) => {
            const Link = event.target?.closest(`.${linkClass}`);
            const textToTranslate = Link?.parentElement.textContent?.trim();
            
            if (Link && textToTranslate) {
                Link.href = `https://translate.google.com/?sl=${sourceLanguage}&tl=${targetLanguage}&op=translate&text=${encodeURI(textToTranslate)}`;
            }
        };

        const elemsToGetLink = document.querySelectorAll('.verbzelletd:nth-child(2)');

        elemsToGetLink.forEach((elem) => {
            const Icon = document.createElement('i');
            Icon.classList.add('fa-solid', 'fa-language');
            const GTLinkElem = document.createElement('a');
            GTLinkElem.classList.add(linkClass);
            GTLinkElem.target = '_blank';
            GTLinkElem.appendChild(Icon);

            elem.appendChild(GTLinkElem);

            GTLinkElem.addEventListener('click', clickHandler);
        });

    };

    addGoogleTranslateLink();
})();