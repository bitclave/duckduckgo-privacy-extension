const Parent = window.DDG.base.View
const browserUIWrapper = require('./../base/$BROWSER-ui-wrapper.es6.js')

function BreakageForm (ops) {
    this.model = ops.model
    this.template = ops.template
    this.$root = window.$('.js-breakage-form')
    Parent.call(this, ops)

    this._setup()
}

BreakageForm.prototype = window.$.extend({},
    Parent.prototype,
    {
        _setup: function () {
            this._cacheElems('.js-breakage-form', [
                'close',
                'submit',
                'element',
                'message',
                'dropdown',
                'checkbox'
            ])
            this.bindEvents([
                [this.$close, 'click', this._closeForm],
                [this.$submit, 'click', this._submitForm]
            ])
        },

        _openForm: function (e) {
            this.$el.removeClass('is-hidden')
        },

        _closeForm: function (e) {
            if (e) e.preventDefault()

            this.model.fetch({ firePixel: ['ept', 'off'] })
            this._reloadPage(300)
        },

        _submitForm: function(e) {
            if (e) e.preventDefault()

            if (this.$checkbox.is(':checked')) {
                this.model.set('whitelistOptIn', true)
                this.model.fetch({ firePixel: ['ept', 'off', this.$dropdown.val()] })
            } else {
                this.model.fetch({ firePixel: ['ept', 'off'] })
            }

            this.$element.addClass('is-hidden')
            this.$message.removeClass('is-hidden')
            this._reloadPage(2000)
        },

        _reloadPage: function(delay) {
            setTimeout(() => {
                browserUIWrapper.closePopup()
                browserUIWrapper.reloadTab(this.model.tab.id)
                this.destroy()
            }, delay)
        }
    }
)

module.exports = BreakageForm