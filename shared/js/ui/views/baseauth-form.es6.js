const Parent = window.DDG.base.View
const baseAuthFormTemplate = require('../templates/baseauth-form.es6')

function BaseAuthForm(ops) {
    this.model = ops.model
    this.template = baseAuthFormTemplate

    Parent.call(this, ops)

    this._setup()
    this.model.checkAuthorization();
}

BaseAuthForm.prototype = window.$.extend({},
    Parent.prototype,
    {
        _setup: function () {
            this._cacheElems('.js-baseauth', [
                'mnemonic',
                'authenticate',
                'logout',
            ])

            this.bindEvents([
                [this.store.subscribe, `change:baseauthForm`, this._onModelChange],
                [this.$mnemonic, `input`, this._onMnemonicChange],
                [this.$authenticate, `click`, this._onAuthenticateClick],
                [this.$logout, `click`, this._onLogoutClick]
            ])
        },

        _onModelChange: function (e) {
            const attr = e.change.attribute;
            const val = e.change.value;

            if (attr === 'errored' && val !== null ||
                attr === 'publicKey'
            ) {
                this.unbindEvents()
                this._rerender()
                this._setup()
            }
        },

        _onMnemonicChange: function () {
            this.model.set('mnemonic', this.$mnemonic.val())
        },

        _onLogoutClick: function (e) {
            e.preventDefault()

            this.model.logout();
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
