const GoogleAd = require('./google-base-ad.es6');
const EmptyBaseAd = require('./empty-base-ad.es6');

class BaseAdStrategy {

    constructor() {
        this._strategies = [new GoogleAd()];
        this._currentStrategy = new EmptyBaseAd();
    }

    support(document) {
        for (const strategy of this._strategies) {
            if (strategy.support(document)) {
                this._currentStrategy = strategy;
                return true;
            }
        }

        this._currentStrategy = new EmptyBaseAd();
        return false
    }

    getSearchResult(document) {
        return this._currentStrategy.getSearchResult(document);
    }

    getRootElement(document) {
        return this._currentStrategy.getRootElement(document);
    }

    getStrategyName() {
        return this._currentStrategy.getStrategyName();
    }

    getQuery(document) {
        return this._currentStrategy.getQuery(document);
    }
}

module.exports = BaseAdStrategy;
