import Base, {ManagersModuleFactory, TokenType} from "@bitclave/base-client-js";

class BaseClient {

    authenticationByAccessToken(token) {
        const module = ManagersModuleFactory.createRemoteManagers('https://base-client-js-remote.herokuapp.com');
        this.base = new Base(module);

        return this.base.accountManager
            .authenticationByAccessToken(token, TokenType.KEYCLOACK_JWT, 'some secret message')
            .catch((e) => Promise.resolve(e));
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
