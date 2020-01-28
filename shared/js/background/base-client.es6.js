import Base, {ManagersModuleFactory, TokenType} from "@bitclave/base-client-js";

const Config = require('../../data/constants');
const settings = require('./settings.es6');

class BaseClient {

    authenticationByAccessToken(token) {
        const module = ManagersModuleFactory.createRemoteManagers(Config.baseRemoteClient);
        this.base = new Base(module);

        return this.base.accountManager
            .authenticationByAccessToken(token, TokenType.KEYCLOACK_JWT, 'some secret message')
            .catch((e) => {
                this.base = null;
                Promise.resolve(e)
            });
    }

    searchByQuery(query) {
        return this._wakeUpAuthorization()
            .then((base) => base
                ? base.searchManager.createSearchResultByQuery(query, -1, 0, Config.baseQueryPageLimit)
                : Promise.resolve(new Error('not authorized'))
            )
    }

    getPublicKey() {
        return this.base ? this.base.accountManager.getAccount().publicKey : null;
    }

    logout() {
        this.base = null;
    }

    _wakeUpAuthorization() {
        if (!this.base) {
            return settings.ready()
                .then(() => {
                    const token = settings.getSetting('base-token');

                    return token
                        ? this.authenticationByAccessToken(token)
                            .then((account) => account.hasOwnProperty('publicKey')
                                ? Promise.resolve(this.base)
                                : Promise.resolve(null)
                            )
                        : Promise.resolve(null);
                })
        }

        return Promise.resolve(this.base);
    }
}

const baseClient = new BaseClient();
module.exports = baseClient;
