const Parent = window.DDG.base.Model

function BaseAuthForm(attrs) {
    attrs = attrs || {}
    attrs.mnemonic = attrs.mnemonic || ''
    attrs.authenticated = false

    Parent.call(this, attrs)
}

BaseAuthForm.prototype = window.$.extend({},
    Parent.prototype,
    {
        modelName: 'baseauthForm',
        authenticate: function () {

            this.fetch({event: {name: 'authentication', value: this.mnemonic}})
                .then((result) => {

                    if (result && result.hasOwnProperty('event') &&
                        result.event.name === 'authentication' && result.event.error === null) {
                        this.set('errored', false);
                        this.set('authenticated', true);
                        this.set('publicKey', result.event.value.publicKey)

                    } else {
                        this.set('errored', true);
                    }
                })
        }
    }
)

module.exports = BaseAuthForm
