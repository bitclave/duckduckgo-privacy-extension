const Parent = window.DDG.base.View
const openOptionsPage = require('./mixins/open-options-page.es6.js')
const browserUIWrapper = require('./../base/$BROWSER-ui-wrapper.es6.js')

function HamburgerMenu (ops) {
    this.model = ops.model
    this.template = ops.template
    Parent.call(this, ops)

    this._setup()
}

HamburgerMenu.prototype = window.$.extend({},
    Parent.prototype,
    openOptionsPage,
    {

        _setup: function () {
            this._cacheElems('.js-hamburger-menu', [
                'close',
                'options-link',
                'feedback-link',
                'broken-site-link',
                'login'
            ])
            this.bindEvents([
                [this.$close, 'click', this._closeMenu],
                [this.$optionslink, 'click', this.openOptionsPage],
                [this.$feedbacklink, 'click', this._handleFeedbackClick],
                [this.$brokensitelink, 'click', this._handleBrokenSiteClick],
                [this.$login, 'click', this._handleLogin],
                [this.model.store.subscribe, 'action:search', this._handleAction],
                [this.model.store.subscribe, 'change:site', this._handleSiteUpdate]
            ])
        },

        _handleAction: function (notification) {
            if (notification.action === 'burgerClick') this._openMenu()
        },

        _openMenu: function (e) {
            this.$el.removeClass('is-hidden')
        },

        _closeMenu: function (e) {
            if (e) e.preventDefault()
            this.$el.addClass('is-hidden')
        },

        _handleFeedbackClick: function (e) {
            e.preventDefault()

            browserUIWrapper.openExtensionPage(`/html/feedback.html`)
        },

        _handleBrokenSiteClick: function (e) {
            e.preventDefault()

            let url = encodeURIComponent(this.model.tabUrl)
            browserUIWrapper.openExtensionPage(`/html/feedback.html?broken=1&url=${url}`)
        },

        _handleSiteUpdate: function (notification) {
            if (notification && notification.change.attribute === 'tab') {
                this.model.tabUrl = notification.change.value.url
                this._rerender()
                this._setup()
            }
        },

        _handleLogin: function (e) {
            e.preventDefault()
            const widgetOptionsDesktop = {
                isMnemonicScreen: false,
                verificationMessage: 'unguessable random message',
                buttonStyle: {
                    // 'display': 'block',
                    'float': 'right',
                    'width': 'auto',
                    // 'background': 'rgba(255, 255, 255, 0.2)',
                    // 'border-radius': '10px',
                    // 'position': 'absolute',
                    // 'right': 0,
                    // 'bottom': '8px',
                    'padding': '0',
                    // 'border': '2px solid #27AE60',
                    // 'border-radius': '6px',
                    'color': '#000',
                    'font-family': '"Roboto", sans-serif',
                    'font-weight': 500,
                    'font-size': '26px',
                    'line-height': '28px',
                    'text-transform': 'upperCase',
                    // 'text-decoration': 'none',
                    'margin': '9px 20px 0',
                    // 'overflow': 'hidden',
                    '-webkit-appearance': 'none',
                    '-moz-appearance': 'none',
                    'appearance': 'none',
                    // 'cursor': 'pointer',
                    // 'text-align': 'center',
                    'outline': 'none',
                    'background': 'transparent',
                    'user-select': 'none'
                }
            }
            const onInit = function (method) {
                console.log('onInit started')
                if (method === 'SDK.onInit') {
                    console.log('onInit SDK.onInit')
                }
            }
            
            this.model.baseWidget = new BASEAuthSDK.Widget(widgetOptionsDesktop)
            this.model.baseWidget.insertLoginButton('#login')
            this.model.baseWidget.listenForInit(onInit)
            this.model.baseWidget.openSignInProgrammatically()
            this.model.baseWidget.listenForLogin(account => {
                console.log("User has logged in! Public key: " + account.publicKey)
            })
        }
    }
)

module.exports = HamburgerMenu
