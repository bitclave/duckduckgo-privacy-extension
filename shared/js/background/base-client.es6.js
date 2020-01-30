import Base, {FileMeta, ManagersModuleFactory, TokenType} from "@bitclave/base-client-js";

const Config = require('../../data/constants');
const settings = require('./settings.es6');

class BaseClient {

    authenticationByAccessToken(token) {
        const module = ManagersModuleFactory.createRemoteManagers(Config.baseRemoteClient);
        this.base = new Base(module);

        return this.base.accountManager
            .authenticationByAccessToken(token, TokenType.KEYCLOACK_JWT, 'some secret message')
            .then(account => {
                this.getProfile().then();
                return Promise.resolve(account)
            })
            .catch((e) => {
                this.base = null;
                return Promise.resolve(e)
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

    getProfile() {
        return settings.ready()
            .then(() => Promise.resolve(settings.getSetting('profile')))
            .then(profile => profile
                ? Promise.resolve(JSON.parse(profile))
                : this._wakeUpAuthorization()
                    .then(base => !base
                        ? Promise.resolve(new Error('not authorized'))
                        : this._getProfileData(base).then(profile => this._saveProfileData(profile))
                    ));
    }

    getUserAvatar(base, avatarId) {
        return base.profileManager
            .getData(avatarId)
            .then(result => {
                try {
                    const strJson = result.get(avatarId);

                    return Promise.resolve(FileMeta.fromJson(JSON.parse(strJson)));
                } catch (e) {
                }

                return Promise.resolve(new FileMeta())
            })
            .then(fileMeta => this._getBase64ByFileId(base, fileMeta, avatarId));
    }

    _getBase64ByFileId(base, file, key) {
        return !file || file.id <= 0
            ? Promise.resolve('')
            : base.profileManager.downloadFile(file.id, key)
                .then(data => Promise.resolve(data ? `url(data:${file.mimeType};base64,${data})` : ''));
    }

    logout() {
        this.base = null;
        settings.ready()
            .then(() => settings.updateSetting('profile', null))
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

    _getProfileData(base) {
        return base.profileManager.getData(
            ['avatar_id', 'firstName', 'firstname', 'lastName', 'lastname', 'email']
        )
            .then((clientData) => {
                const avatarId = clientData.get('avatar_id') || '';

                return this.getUserAvatar(base, avatarId)
                    .then((avatarBase64Image) =>
                        Promise.resolve({
                            firstName: clientData.get('firstName') || clientData.get('firstname') || '',
                            lastName: clientData.get('lastName') || clientData.get('lastname') || '',
                            email: clientData.get('email') || '',
                            avatar: avatarBase64Image
                        })
                    )
            })
    }

    _saveProfileData(profile) {
        return settings.ready()
            .then(() => {
                settings.updateSetting('profile', JSON.stringify(profile));
                return Promise.resolve(profile)
            })
    }
}

const baseClient = new BaseClient();
module.exports = baseClient;
