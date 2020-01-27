const Parent = window.DDG.base.Model;
const BaseAuth = require('../base/base-auth.es6');

function BaseAuthForm(attrs) {
    attrs = attrs || {};
    attrs.authenticated = false;
    attrs.token = null;
    attrs.publicKey = null;
    attrs.waitAuth = false;

    Parent.call(this, attrs);
}

BaseAuthForm.prototype = window.$.extend({},
    Parent.prototype,
    {
        modelName: 'baseauthForm',

        listen: function () {
            BaseAuth.listenForLogin((account) => {
                if (!this.waitAuth) {
                    this._authenticate(account.token);
                }
            });
        },

        signIn: function () {
            BaseAuth.openSignInProgrammatically()
        },

        signUp: function () {
            BaseAuth.openSignUpProgrammatically()
        },

        logout: function () {
            BaseAuth.logout();
            this.fetch({updateSetting: {name: 'base-token', value: null}});
            this.fetch({event: {name: 'logout'}})
                .then((result) => {
                    if (result && result.hasOwnProperty('event') &&
                        result.event.name === 'logout' && result.event.error === null) {
                        this.set('authenticated', false);
                        this.set('token', null);
                        this.set('publicKey', null);

                    } else {
                        this.set('errored', true);
                    }
                })
        },

        checkAuthorization: function () {
            this.fetch({getSetting: {name: 'base-token'}})
                .then((result) => this.set('token', result))
                .then(() => this.fetch({event: {name: 'getPublicKey'}}))
                .then(result => {
                    this.set('publicKey', result.event.value);
                    this.set('authenticated', this.token !== null && this.publicKey !== null);
                })
        },

        _authenticate: function (token) {
            this.set('waitAuth', true);
            this.fetch({updateSetting: {name: 'base-token', value: token}});

            this.fetch({event: {name: 'authentication', value: token}})
                .then((result) => {
                    this.set('waitAuth', false);

                    if (result && result.hasOwnProperty('event') &&
                        result.event.name === 'authentication' && result.event.error === null) {
                        this.set('publicKey', result.event.value.publicKey);
                        this.set('authenticated', true);

                    } else {
                        this.set('errored', true);
                    }
                })
        }
    }
);

module.exports = BaseAuthForm;
