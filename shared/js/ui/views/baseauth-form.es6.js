const Parent = window.DDG.base.View;
const baseAuthFormTemplate = require('../templates/baseauth-form.es6');
const BaseAuth = require('../base/base-auth.es6');

function BaseAuthForm(ops) {
    this.model = ops.model;
    this.template = baseAuthFormTemplate;

    Parent.call(this, ops);

    BaseAuth.insertLoginButton('#login');
    this._setup();
}

BaseAuthForm.prototype = window.$.extend({},
    Parent.prototype,
    {
        _setup: function () {
            this._cacheElems('.js-baseauth', [
                'signin',
                'signup',
                'logout',
                'loginMessage',
                'init',
                'loginProcess'
            ]);

            this.bindEvents([
                [this.store.subscribe, `change:baseauthForm`, this._onModelChange],
                [this.$signin, 'click', this._onSignInClick],
                [this.$signup, 'click', this._onSignUpClick],
                [this.$logout, 'click', this._onLogoutClick],
            ]);

            this.$loginProcess.hide();
            this.$loginMessage.hide();
            this.$signin.hide();
            this.$signup.hide();
            this.$logout.hide();

            this.model.listen();
            BaseAuth.listenForInit(() => this.model.checkAuthorization());
        },

        _onModelChange: function (e) {
            const attr = e.change.attribute;
            const val = e.change.value;

            if (attr === 'errored' && val !== null ||
                attr === 'authenticated' ||
                attr === 'waitAuth'
            ) {
                if (this.model.waitAuth) {
                    this.$loginProcess.show();
                    this.$signin.hide();
                    this.$signup.hide();
                    return
                }

                this.unbindEvents();
                this._rerender();
                this._setup();

                this.$loginProcess.hide();
                this.$init.hide();

                if (!this.model.authenticated && (this.model.token || this.model.publicKey)) {
                    this.$signin.hide();
                    this.$signup.hide();
                    this.$logout.hide();

                } else if (this.model.authenticated && (this.model.token || this.model.publicKey)) {
                    this.$signin.hide();
                    this.$signup.hide();
                    this.$logout.show();
                    this.$loginMessage.show();

                } else {
                    this.$signin.show();
                    this.$signup.show();
                    this.$logout.hide();
                    this.$loginMessage.hide();
                }
            }
        },

        _onSignInClick: function (e) {
            e.preventDefault();

            this.model.signIn();
        },

        _onSignUpClick: function (e) {
            e.preventDefault();

            this.model.signUp();
        },

        _onLogoutClick: function (e) {
            e.preventDefault();

            this.model.logout();
        },
    }
);

module.exports = BaseAuthForm;
