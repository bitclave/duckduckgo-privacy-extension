const Parent = window.DDG.base.View
const baseAuthFormTemplate = require('../templates/baseauth-form.es6')

function BaseAuthForm(ops) {
    this.model = ops.model
    this.template = baseAuthFormTemplate

    Parent.call(this, ops)

    this._setup()
}

BaseAuthForm.prototype = window.$.extend({},
    Parent.prototype,
    {
        _setup: function () {
            this._cacheElems('.js-baseauth', [
                'mnemonic',
                'authenticate'
            ])

            this.bindEvents([
                [this.store.subscribe, `change:baseauthForm`, this._onModelChange],
                [this.$mnemonic, `input`, this._onMnemonicChange],
                [this.$authenticate, `click`, this._onAuthenticateClick]
            ])
        },

        _onModelChange: function (e) {
            console.log(e);
            const attr = e.change.attribute;
            const val = e.change.value;

            if (attr === 'errored' && val !== null || attr === 'publicKey' && val && val.length > 0) {
                this.unbindEvents()
                this._rerender()
                this._setup()
            }
        },

        _onMnemonicChange: function () {
            this.model.set('mnemonic', this.$mnemonic.val())
        },

        _onAuthenticateClick: function (e) {
            e.preventDefault()

            this.model.authenticate()

            this.$authenticate.addClass('is-disabled')
            this.$authenticate.text('Authentication...')
        }
    }
)

module.exports = BaseAuthForm
