const fs = require('fs');
const appUtils = require("./appUtils");
const gitConnector = require("../git/gitConnector");
const path = require('path');
const logger = require('./logger');

class WindowUtils {

    /**
     * Return window git relative path
     * @param {*} application 
     * @param {*} name 
     * @returns 
     */
    getWindowRelativePath(name) {
        return path.join("windows", `${name}.json`);
    }

    /**
     * Return window absolute path
     * @param {*} application 
     * @param {*} window 
     * @returns 
     */
    getWindowAbsolutePath(application, window) {
        return path.join(appUtils.getAppFolder(application), this.getWindowRelativePath(window));
    }

    /**
     * Return window translations git relative path
     * @param {*} application 
     * @param {*} name 
     * @returns 
     */
    getWindowTranslationsRelativePath(name, language) {
        return path.join("windows", `${name}.${language}.json`);
    }

    /**
     * Return window translations absolute path
     * @param {*} application 
     * @param {*} window 
     * @returns 
     */
    getWindowTranslationsAbsolutePath(application, window, language) {
        return path.join(appUtils.getAppFolder(application), this.getWindowTranslationsRelativePath(window, language));
    }

    /**
     * Return window raw JSON data
     * @param {string} appId application id
     * @param {string} window  window name
     * @returns window string data
     */
    getWindowRawData(application, window) {
        if (!application) {
            throw "Application required!";
        }

        const appConfigration = appUtils.getAppConfiguration(application);
        if (!appConfigration) {
            console.error(`App ${application} not found in .env file`);
            return null;
        }

        const windowPath = this.getWindowAbsolutePath(application, window);

        if (!fs.existsSync(windowPath)) {
            return null;
        }

        return fs.readFileSync(windowPath, 'utf8');
    }

    /**
     * Crea una finestra per l'applicazione passata
     * @param {*} application 
     * @param {*} name 
     * @param {*} windowData 
     */
    createWindow(application, user, name, windowData) {

        if (this.getWindowRawData(application, name)) {
            //la finestra esiste già
            return Promise.reject(new Error('window already exists'));
        }
        const windowPath = this.getWindowRelativePath(name);
        return gitConnector.writeFile(application, user, windowPath, windowData);
    }

    /**
     * Crea una finestra per l'applicazione passata
     * @param {*} application 
     * @param {*} name 
     * @param {*} windowData 
     */
    updateWindow(application, user, name, windowData) {

        if (!this.getWindowRawData(application, name)) {
            //la finestra non esiste
            return Promise.reject(new Error('window not exists'));
        }
        const windowPath = this.getWindowRelativePath(name);
        return gitConnector.writeFile(application, user, windowPath, windowData);
    }

    deleteWindow(application, user, id) {
        if (!application || !id) {
            //la finestra esiste già
            return Promise.reject(new Error('missing window data'));
        }

        const windowPathRel = this.getWindowRelativePath(id);
        const windowPathAbs = this.getWindowAbsolutePath(application, id);

        if (!fs.existsSync(windowPathAbs)) {
            //lo script non esiste
            return Promise.reject(new Error('window not exists'));
        }
        return gitConnector.deleteFile(application, user, windowPathRel);
    }


    /**
     * Ritorna la lista di finestre di una applicazione
     * @param {*} application 
     */
    list(application) {
        const appConfigration = appUtils.getAppConfiguration(application);
        if (!appConfigration) {
            console.error(`App ${application} not found in .env file`);
            return Promise.reject(`App ${application} not found`);
        }

        const windowsPath = path.join(appUtils.getAppFolder(application), "windows");
        const windows = fs.readdirSync(windowsPath);

        return Promise.resolve(windows);
    }

    /**
         * Return window translations
         * 
         * @param {string} appId application id
         * @param {string} window  window name
         * @param {string} language  language
         * @returns translation object
         */
    getWindowTranslationsRawData(application, window, language) {
        if (!application) {
            throw "Application required!";
        }
        if (!window) {
            throw "Window required!";
        }
        if (!language) {
            throw "Language required!";
        }

        const appConfigration = appUtils.getAppConfiguration(application);
        if (!appConfigration) {
            console.error(`App ${application} not found in .env file`);
            return null;
        }

        const windowTranslationsPath = this.getWindowTranslationsAbsolutePath(application, window, language);

        if (fs.existsSync(windowTranslationsPath)) {
            const translationsData = fs.readFileSync(windowTranslationsPath, 'utf8');
            return translationsData
        }

        return JSON.stringify({})
    }

    /**
     * Return window translations
     * 
     * @param {string} appId application id
     * @param {string} window  window name
     * @param {string} language  language
     * @returns translation object
     */
    getWindowTranslations(application, window, language) {
        return JSON.parse(this.getWindowTranslationsRawData(application, window, language))
    }

}

module.exports = new WindowUtils();