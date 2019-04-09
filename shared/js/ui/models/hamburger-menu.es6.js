const Parent = window.DDG.base.Model

function HamburgerMenu (attrs) {
    attrs = attrs || {}
    attrs.tabUrl = ''
    attrs.baseWidget = null
    Parent.call(this, attrs)
}

HamburgerMenu.prototype = window.$.extend({},
    Parent.prototype,
    {
        modelName: 'hamburgerMenu'
    }
)

module.exports = HamburgerMenu
