const fs = require('fs');
const appUtils = require("./appUtils");
const gitConnector = require("../git/gitConnector");
const path = require('path');
const logger = require('./logger');

class RoleUtils {

    ADMIN_ROLE_VALUE = {
        "description" : "Admin role",
        "scripts": ["*"],
        "windows": [{
            "*": {}
        }]
    }

    /**
     * Ritorna il path relativo del file di gestione dei ruoli rispetto a git
     * @param {*} application 
     * @returns 
     */
    getRoleRelativePath() {
        return path.join("roles", `role.json`);
    }

    /**
     * Ritorna il path assoluto del file dei ruoli
     * @param {*} application 
     * @param {*} window 
     * @returns 
     */
    getRoleAbsolutePath(application, window) {
        return path.join(appUtils.getAppFolder(application), this.getRoleRelativePath(window));
    }

    /**
     * Ritorna l'oggetto di una finestra
     * @param {string} application application id
     * @returns window string data
     */
    getRoleRawData(application) {
        if (!application) {
            throw "Application required!";
        }

        const appConfigration = appUtils.getAppConfiguration(application);
        if (!appConfigration) {
            console.error(`App ${application} not found in .env file`);
            return null;
        }

        const rolePath = this.getRoleAbsolutePath(application);

        if (!fs.existsSync(rolePath)) {
            //creo il file di default
            this.createRoleFile(application);
            if (!fs.existsSync(rolePath)) {
                return null;
            }
        }

        return fs.readFileSync(rolePath, 'utf8');
    }

    /**
     * Crea il file di default dei ruoli
     * @param {*} application 
     */
    createRoleFile(application) {
    
        const filePathAbs = this.getRoleAbsolutePath(application);
        if (fs.existsSync(filePathAbs)) {
            return null;
        }

        const defalutRole = {
            "ADMIN": this.ADMIN_ROLE_VALUE
        };

        const filePath = this.getRoleRelativePath(application);
        return gitConnector.writeFile(application, "ADMIN", filePath,JSON.stringify(defalutRole));
    }

    /**
     * Crea una finestra per l'applicazione passata
     * @param {string} application 
     * @param {string} name 
     * @param {string} data 
     */
    updateRole(application, user, data) {

        if (!this.getRoleRawData(application)) {
            //la finestra esiste già
            return Promise.reject(new Error('role file not exists'));
        }

        const roleObj = JSON.parse(data);
        if(!roleObj.ADMIN){
            return Promise.reject(new Error('can\'t remove ADMIN role'));
        }
        roleObj.ADMIN = this.ADMIN_ROLE_VALUE; //guai o mal lo ripristino sempre

        const windowPath = this.getRoleRelativePath();
        return gitConnector.writeFile(application, user, windowPath, data);
    }

}

module.exports = new RoleUtils();