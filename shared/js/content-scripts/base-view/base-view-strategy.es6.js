const GoogleBaseView = require('./google-base-view.es6');
const EmptyBaseView = require('./empty-base-view.es6');

class BaseViewStrategy {

    constructor() {
        this._strategies = new Map([['GOOGLE', new GoogleBaseView()]]);
        this._currentStrategy = new EmptyBaseView();
    }

    changeStrategy(strategyName) {
        this._currentStrategy = this._strategies.get(strategyName);

        return this;
    }

    onClickListener(cb) {
        this._currentStrategy.onClickListener(cb);

        return this;
    }

    render(rootElement, page) {
        this._currentStrategy.render(rootElement, page);
    }
}

module.exports = BaseViewStrategy;
