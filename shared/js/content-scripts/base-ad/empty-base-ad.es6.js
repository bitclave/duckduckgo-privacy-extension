import {Page} from "@bitclave/base-client-js";

class EmptyBaseAd {

    support(document) {
        return false;
    }

    getSearchResult(document) {
        return new Page();
    }

    getRootElement(document) {
        return null;
    }

    getStrategyName() {
        return 'DEFAULT';
    }

    getQuery(document) {
        return '';
    }
}

module.exports = EmptyBaseAd;