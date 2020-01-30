const bel = require('bel')

module.exports = function (model) {
    return bel`<div 
                    class="base-profile-simple js-site-profile-content" 
                    style="display: ${model.hasBaseClientInfo ? 'block' : 'none'}"
                 >
    <div class="base-profile-simple__avatar js-site-profile-avatar" style="background-image: ${model.avatar}"></div>
    <div class="base-profile-simple__info">
        <div class="base-profile-simple__info__full-name js-site-profile-full-name">
            ${model.lastName} ${model.firstName} 
        </div>
        <div class="base-profile-simple__info__email js-site-profile-email">${model.email}</div>
    </div>
    </div>`
}
