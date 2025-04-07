/**
 * Remove some demotivating and distracting elements from the daily trainer end screen
 */
const initCleanUpEndScreen = () => {
    function isDownloadCertificateSection(sectionTextContent) {
        return sectionTextContent.includes('Kostenloses Zertifikat über deinen Lernerfolg');
    };

    function isKnowledgeProgressSection(sectionTextContent) {
        return sectionTextContent.startsWith('Dein Wissensverlauf');
    };

    function isBetterThanOthersSection(sectionTextContent) {
        return sectionTextContent.includes('Du bist im Moment besser als');
    };

    function isBadgesForDaysInRowSection(sectionTextContent) {
        return sectionTextContent.includes('Deine Abzeichen für in Folge gelernte Tage');
    };

    function isBadgesForVocabAmountSection(sectionTextContent) {
        return sectionTextContent.includes('Deine Abzeichen für insgesamt gelernte Vokabeln');
    };

    function isPointsPerVocabSection(sectionTextContent) {
        return sectionTextContent.includes('Punkte pro Vokabel:');
    };

    function improveRedeemRewardsSection(section) {
        if (section.textContent.includes('Für deine erzielten Punkte bekommst du Prämien, die du hier einlösen kannst:')) {
            const contentWrap = section.querySelector('.normaltext2');
            if (!contentWrap) return;

            contentWrap.childNodes.forEach((node) => {
                if (node.textContent.includes('Punkte pro Wort, weil du dann')) {
                    // remove this single text node because the given streak is usually inaccurate and the points are irrelevant
                    node.textContent = '';
                }
            });
        }
    };

    function isFacebookCommunitySection(sectionTextContent) {
        return sectionTextContent.includes('Die Lerngemeinschaft auf Facebook');
    };

    function isBookSection(sectionTextContent) {
        return sectionTextContent.includes('Das Buch zum Sprachkurs:') || sectionTextContent.includes('Neues Buch:');
    };

    function isFollowOnSocialMediaSection(sectionTextContent) {
        return sectionTextContent.includes('Folge Sprachenlernen24:');
    };

    function isRateCourseSection(sectionTextContent) {
        return sectionTextContent.includes('Wie gefällt dir dieser Kurs?');
    };

    function isFollowOnFacebookSection(sectionTextContent) {
        return sectionTextContent.includes('Markiere unsere Facebook-Seite');
    };

    function isEarnMoneySection(sectionTextContent) {
        return sectionTextContent.includes('Erhalte Provisionen für die Vermittlung');
    };

    const doTheActualThing = () => {
        const endScreenSectionsSelector = '.endseitenbox';
        const endScreenSections = document.querySelectorAll(endScreenSectionsSelector);

        if (endScreenSections.length === 0) return;

        endScreenSections.forEach((section) => {
            const sectionTextContent = section.textContent;
            if (!sectionTextContent) return;

            if (
                isDownloadCertificateSection(sectionTextContent) ||
                isKnowledgeProgressSection(sectionTextContent) ||
                isBetterThanOthersSection(sectionTextContent) ||
                isBadgesForDaysInRowSection(sectionTextContent) ||
                isBadgesForVocabAmountSection(sectionTextContent) ||
                isPointsPerVocabSection(sectionTextContent) ||
                isFacebookCommunitySection(sectionTextContent) ||
                isBookSection(sectionTextContent) ||
                isFollowOnSocialMediaSection(sectionTextContent) ||
                isRateCourseSection(sectionTextContent) ||
                isFollowOnFacebookSection(sectionTextContent) ||
                isEarnMoneySection(sectionTextContent)
            ) {
                section.classList.add('hide-end-screen-section');
            }

            improveRedeemRewardsSection(section);
        });
    };

    const cleanUpEndScreen = ({ observer, observerTargetNode, observerConfig }) => {
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

    return cleanUpEndScreen;
};