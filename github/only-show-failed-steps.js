// ==UserScript==
// @name         Only Show Failed GitHub CI Checks
// @namespace    https://github.com/
// @version      1.0.1
// @description  Only show failed GitHub workflow jobs on PR page
// @author       You
// @match        https://github.com/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    function wait_element(root, selector) {
        return new Promise((resolve, reject) => {
            (new MutationObserver(check)).observe(root, {childList: true, subtree: true});
            function check(changes, observer) {
                let element = root.querySelector(selector);
                if(element) {
                    observer.disconnect();
                    resolve(element);
                }
            }
        });
    }

    await wait_element(document, '.merge-status-list');

    const allGithubChecks = document.querySelectorAll('.merge-status-item');

    let modified = false;

    allGithubChecks.forEach(item => {
        const svg = item.querySelector('svg');
        if (svg.matches('.octicon-check') || svg.matches('.octicon-skip') || svg.matches('.octicon-stop') || svg.matches('.octicon-square-fill')) {
            item.hidden = true;
            modified = true;
        }
    });

    if (modified) {
        const statusHeader = document.querySelector('.merge-status-list');

        const skippedHiddenStatusText = document.createElement('p');
        skippedHiddenStatusText.textContent = 'Non-failed steps are hidden 🥷';
        skippedHiddenStatusText.style.margin = '1rem';
        skippedHiddenStatusText.style.textAlign = 'center';

        statusHeader.prepend(skippedHiddenStatusText);
    }

})();
