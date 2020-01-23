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

        logout: function () {
            this.fetch({event: {name: 'logout'}})
                .then((result) => {
                    if (result && result.hasOwnProperty('event') &&
                        result.event.name === 'logout' && result.event.error === null) {
                        this.set('authenticated', false);
                        this.set('publicKey', null)

                    } else {
                        this.set('errored', true);
                    }
                })
        },

        checkAuthorization: function () {
            this.fetch({event: {name: 'getPublicKey'}})
                .then((result) => {
                    if (result && result.hasOwnProperty('event') &&
                        result.event.name === 'getPublicKey' && result.event.error === null) {
                        if (result.event.value) {
                            this.set('authenticated', true);
                            this.set('publicKey', result.event.value)

                        } else {
                            this.set('authenticated', false);
                            this.set('publicKey', null)
                        }

                    } else {
                        this.set('errored', true);
                    }
                })
        },

        authenticate: function () {

            this.fetch({event: {name: 'authentication', value: this.mnemonic}})
                .then((result) => {

                    if (result && result.hasOwnProperty('event') &&
                        result.event.name === 'authentication' && result.event.error === null) {
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
