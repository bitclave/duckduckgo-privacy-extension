import Base, {InternalManagerModule} from "@bitclave/base-client-js";

class BaseClient {

    authenticationByPassPhrase(mnemonic) {
        const module = InternalManagerModule.Builder('https://base2-bitclva-com-eu.herokuapp.com', 'localhost').build();
        this.base = new Base(module);
        return this.base.accountManager.authenticationByPassPhrase(mnemonic, 'some secret message')
            .then(account => Promise.resolve(account));
    }

    getPublicKey() {
        return this.base ? this.base.accountManager.getAccount().publicKey : null;
    }

    logout() {
        this.base = null;
    }
}

const baseClient = new BaseClient();
module.exports = baseClient;
