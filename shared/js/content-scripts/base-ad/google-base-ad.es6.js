const browserWrapper = require('../../ui/base/$BROWSER-ui-wrapper.es6');

class GoogleBaseAd {

    support(document) {
        const hasSupportOrigin = document.location.origin.toLowerCase().search('google') > -1;
        const hasSupportElement = document.getElementById('rcnt') !== null;

        return hasSupportOrigin && hasSupportElement;
    }

    getSearchResult(document) {
        const params = new URLSearchParams(document.location.search.substr(1));

        return browserWrapper
            .fetch({event: {name: 'search', value: params.get('q')}})
            .then(result => {
                if (result && result.hasOwnProperty('event') &&
                    result.event.name === 'search' && result.event.value) {

                    return Promise.resolve(result.event.value)
                } else {
                    const errorMsg = result && result.hasOwnProperty('event') ? result.event.error : 'undefined error';
                    throw new Error(errorMsg);
                }
            });
    }

    getRootElement(document) {
        return document.getElementById('rcnt');
    }

    getStrategyName() {
        return 'GOOGLE'
    }

    getQuery(document) {
        const params = new URLSearchParams(document.location.search.substr(1));

        return params.get('q');
    }
}

module.exports = GoogleBaseAd;
