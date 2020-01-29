const bel = require('bel');

class GoogleBaseView {

    constructor() {
        this._onClickListener = () => {
        }
    }

    render(rootElement, page) {
        if (page.content.length <= 0) {
            return;
        }

        const items = page.content.map(item => this._prepareItem(item.offer));

        const view = bel`
            <div class="base-view__content">
                ${items}
                <div class="base-view__button__more">>></div>
            </div>
        `;

        view.querySelector('.base-view__button__more')
            .addEventListener('click', () => this._onClickListener().bind(this), false);

        rootElement.before(view);
    }

    onClickListener(cb) {
        this._onClickListener = cb;
    }

    _prepareItem(item) {
        const price = item.offerPrices.length > 0 ? item.offerPrices[0].worth : 0;

        const element = bel`
            <div class="base-view__item">
                <div class="base-view__item__image-content">
                    <img class="base-view__item__image-content__image" src="${item.imageUrl}" alt="${item.title}"/>
                </div>
                <div class="base-view__item__title">${item.title}</div>
                <div class="base-view__item__price">${parseFloat(price).toLocaleString()} $</div>
                <div class="base-view__item__button">Get Cash Back</div>
            </div>
        `;

        element.addEventListener('click', () => this._onClickListener(item).bind(this), false);

        return element;
    }
}

module.exports = GoogleBaseView;
