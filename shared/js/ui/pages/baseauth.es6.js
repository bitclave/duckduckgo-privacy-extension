const Parent = window.DDG.base.Page
const mixins = require('./mixins/index.es6')
const BaseAuthFormView = require('../views/baseauth-form.es6')
const BaseAuthFormModel = require('../models/baseauth-form.es6')

function BaseAuth (ops) {
    Parent.call(this, ops)
}

BaseAuth.prototype = window.$.extend({},
    Parent.prototype,
    mixins.setBrowserClassOnBodyTag,
    {

        pageName: 'baseauth',

        ready: function () {
            Parent.prototype.ready.call(this)
            this.setBrowserClassOnBodyTag()

            this.form = new BaseAuthFormView({
                appendTo: window.$('.js-baseauth-form'),
                model: new BaseAuthFormModel({})
            })
        }
    }
)

// kickoff!
window.DDG = window.DDG || {}
window.DDG.page = new BaseAuth()
