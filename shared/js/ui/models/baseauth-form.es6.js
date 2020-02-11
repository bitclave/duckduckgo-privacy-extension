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
            if (window.navigator.appName.toLowerCase() === 'netscape') {
                this._mozillaAuthWebFlow('auth')
            } else {
                BaseAuth.openSignInProgrammatically()
            }
        },

        signUp: function () {
            if (window.navigator.appName.toLowerCase() === 'netscape') {
                this._mozillaAuthWebFlow('registrations')
            } else {
                BaseAuth.openSignUpProgrammatically()
            }
        },

        logout: function () {
            BaseAuth.logout();
            this.fetch({updateSetting: {name: 'base-token', value: null}});
            this.fetch({event: {name: 'logout'}})
                .then((result) => {
                    if (result && result.hasOwnProperty('event') &&
                        result.event.name === 'logout' && result.event.error === null) {
                        this.set('token', null);
                        this.set('publicKey', null);
                        this.set('authenticated', false);

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

        _mozillaAuthWebFlow: function (type) {// 'registrations' | 'auth'
            BaseAuth.getAuthUrl(type)
                .then(authUrl => window.browser.identity.launchWebAuthFlow({interactive: true, url: authUrl}))
                .then(authResult => Promise.resolve(new URLSearchParams(authResult).get('access_token')))
                .then(token => BaseAuth.authByToken(token))
                .then(result => this._authenticate(result))
                .catch(e => console.error(e));
        },

        _authenticate: function (token) {
            this.set('waitAuth', true);
            this.fetch({updateSetting: {name: 'base-token', value: token}});

            this.fetch({event: {name: 'authentication', value: token}})
                .then((result) => {
                    if (result && result.hasOwnProperty('event') &&
                        result.event.name === 'authentication' && result.event.error === null) {
                        this.set('publicKey', result.event.value.publicKey);
                        this.set('authenticated', true);

                    } else {
                        this.set('errored', true);
                    }

                    this.set('waitAuth', false);
                })
        }
    }
);

module.exports = BaseAuthForm;
