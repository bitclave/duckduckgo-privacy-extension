const bel = require('bel');

module.exports = function () {
    if (this.model.errored) {
        return showError()
    }

    if (this.model.authenticated) {
        return successAuthenticated.bind(this)()
    }

    return bel`<div>
            <label class='frm__label'>Login via Bitclave Base service</label>
            <label class='frm__label js-baseauth-init'>Please wait while Bitclave Base initialize...</label>
            <label class='frm__label js-baseauth-loginProcess'>Please wait while Bitclave Based authenticate...</label>
            <div class="btn js-baseauth-signin">Sign In</div>
            <div class="btn js-baseauth-signup">Sign Up</div>
            <div class="btn js-baseauth-logout">Logout</div>
        </div>`
}

function successAuthenticated() {
    return bel`<div>
                    <p>Success authenticated in Bitclave Base service.</p>
                    <p>Your public key is: ${this.model.publicKey}</p>
                    <div class="btn js-baseauth-logout">Logout</div>
                </div>`
}

function showError() {
    return bel`<p>Something went wrong when Authenticate. Please try again later!</p>`
}
