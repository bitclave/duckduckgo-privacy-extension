const bel = require('bel')

module.exports = function () {
    if (this.model.errored) {
        return showError()
    }

    if (this.model.authenticated) {
        return successAuthenticated.bind(this)()
    }


    return bel`<div>
            <label class='frm__label'>Please enter you mnemonic phrase of Bitclave Base service</label>
            <input class='frm__input js-baseauth-mnemonic' placeholder='mnemonic phrase'/>
            <div class="btn js-baseauth-authenticate">Authenticate</div>
        </div>`
}

function successAuthenticated() {
    return bel`<div><p>Success authenticated in Bitclave Base service.</p>
                    <p>Your public key is: ${this.model.publicKey}</p>
                </div>`
}

function showError() {
    return bel`<p>Something went wrong when Authenticate. Please try again later!</p>`
}
