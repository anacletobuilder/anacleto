const admin = require('../config/firebase-config');

class UserUtils {

    /**
     * Imposta i ruoli dell'utente
     * 
     * 
     * @param uid - The `uid` of the user to edit.
     * @param customUserClaims - max 1000 byte
     * @returns A promise that resolves when the operation completes successfully.
     */
    setUserRoles(userUid, application, tenant, customUserClaims) {

        if (!userUid || !application || !tenant || !customUserClaims) {
            return Promise.reject(new Error("setUserRoles missing data"));
        }

        return admin.auth().getUser(userUid)
            .then((_user) => {
                const customClaims = _user.customClaims || {};
                let claimsObj = customClaims || {};

                /*
                * customClaims è limitato a 1000 byte, se il json dei ruoli è superiore a 1000 viene "compresso"
                * - versione json: {"TENANT_1":{"APP_1":["ADMIN"],"APP_2":["USER","VENDOR"]},"TENANT_2":{"APP_1":["ADMIN"],"APP_2":["ADMIN"]}}
                * - versione stringa {"string":"@TENANT_1$APP_1#ADMIN$APP_2#USER#VENDOR@TENANT_2$APP_1#ADMIN$APP_2#ADMIN"}
                * 
                */
                if (customClaims?.string) {
                    //il ruolo è stato compresso in una stringa
                    claimsObj = this.claimsToObject(customClaims);
                }

                if (!claimsObj[tenant]) {
                    //li assegno il company se non lo aveva
                    claimsObj[tenant] = {};
                }

                claimsObj[tenant][application] = customUserClaims.map(r => r.id);

                if(JSON.stringify(claimsObj).length > 1000){
                    //TODO salva formato compresso 
                    //{"string":"@TENANT_1$APP_1#ADMIN$APP_2#USER#VENDOR@TENANT_2$APP_1#ADMIN$APP_2#ADMIN"}
                }

                return admin.auth().setCustomUserClaims(userUid, claimsObj)
            });
    }


    /**
     * 
     * @param {*} nextPageToken 
     * @return A promise con la lista utenti e il token per la pagina successiva {users : "", pageToken, ""}
     */
    listUsers(nextPageToken) {
        // List batch of users, 1000 at a time. (google pagina a 1000....noi facciamo meno?)
        if (nextPageToken) {
            return admin.auth().listUsers(1000, nextPageToken);
        } else {
            return admin.auth().listUsers(1000);
        }
    };

    /**
     * Ritrona l'utente
     * @param {string} uid 
     * @returns promise con dettaglio utente
     */
    getUser(uid) {
        if (!uid) {
            return Promise.reject(new Error("missing user uid"));
        }

        return admin.auth().getUser(uid).then((_user) => {
            _user.customClaimsJSON = this.claimsToObject(_user.customClaims);
            return Promise.resolve(_user);
        });
    }

    /**
     * Data la claims di un user crea il json
     * ES: @TENANT_1$APP_1#ADMIN$APP_2#USER#VENDOR@TENANT_2$APP_1#ADMIN$APP_2#ADMIN
     * 
     * ritorna un oggetto:
     * {"TENANT_1":{"APP_1":["ADMIN"],"APP_2":["USER","VENDOR"]},"TENANT_2":{"APP_1":["ADMIN"],"APP_2":["ADMIN"]}}
     * 
     * 
     * @param {*} claims 
     * @returns 
     */
    claimsToObject(claims) {
        if (!claims || !claims.string) {
            return claims;
        }

        let ret = {};
        const tenants = claims.string.split("@");
        for (let i = 1; i < tenants.length; i++) {
            if (!tenants[i]) {
                continue;
            }

            const apps = tenants[i].split("$");
            const tenant = apps[0];
            ret[tenant] = {};
            for (let j = 1; j < apps.length; j++) {
                if (!apps[i]) {
                    continue;
                }

                const appRole = apps[j].split("#");
                const app = appRole[0];
                ret[tenant][app] = appRole.slice(1);
            }
        }
        return ret;
    }

}

module.exports = new UserUtils();
