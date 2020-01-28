const BaseAdStrategy = require('./base-ad/base-ad-strategy.es6');
const BaseViewStrategy = require('./base-view/base-view-strategy.es6');
const Config = require('../../data/constants');

const onLoad = () => {
    const adStrategy = new BaseAdStrategy();
    const viewStrategy = new BaseViewStrategy();

    if (adStrategy.support(document)) {
        adStrategy.getSearchResult(document)
            .then(result => viewStrategy
                .changeStrategy(adStrategy.getStrategyName())
                .onClickListener((item) => {
                    console.log('click on item', item, adStrategy.getQuery(document));
                    const win = window.open(`${Config.shepherd}?q=${adStrategy.getQuery(document)}`, '_blank');
                    win.focus();
                })
                .render(adStrategy.getRootElement(document), result))
    }
};

document.addEventListener('DOMContentLoaded', onLoad, true);
