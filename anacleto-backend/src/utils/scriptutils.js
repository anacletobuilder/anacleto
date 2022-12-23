const fs = require('fs');
const appUtils = require("./appUtils");
const gitConnector = require("../git/gitConnector");
const path = require('path');
const logger = require('./logger');
const fileUtils = require('./fileUtils');

class ScriptUtils {

    /**
     * Ritorna il path relativo del file uno script rispetto a git
     * @param {*} application 
     * @param {*} name 
     * @returns 
     */
    getScriptRelativePath(name) {

        if (name.startsWith("..") || name.startsWith("/") || name.startsWith("\\")) {
            //sono sicuro di bloccare i furbetti anche se cmq c'è la regex sotto
            throw new Error('invalid script id');
        }

        if (!new RegExp(/^\w+(\/*\w+)*$/).test(name)) {
            //solo alfanumeri, pouò esserci il / in caso di cartelle e deve finire con una parola
            throw new Error('invalid script id');
        }

        return path.join("scripts", `${name}.js`);
    }

    /**
     * Ritorna il path assoluto del file dello script
     * @param {*} application 
     * @param {*} script 
     * @returns 
     */
    getScriptAbsolutePath(application, script) {
        return path.join(appUtils.getAppFolder(application), this.getScriptRelativePath(script));
    }

    /**
     * Ritorna l'oggetto di una finestra
     * @param {string} appId application id
     * @param {string} script  script name
     * @param {replaceImport} script opzionale, rimpiazza l'import con lo script corretto
     * @param {array} alreadyImportScript script già importati, verranno ignorati (mi serve in ricorsione)
     * @returns script string data
     */
    getScriptRawData(application, script, replaceImport, alreadyImportScript) {
        if (!application) {
            throw "Application required!";
        }

        const appConfigration = appUtils.getAppConfiguration(application);
        if (!appConfigration) {
            console.error(`App ${application} not found in .env file`);
            return null;
        }

        const scriptPath = this.getScriptAbsolutePath(application, script);

        if (!fs.existsSync(scriptPath)) {
            return null;
        }

        const source = fs.readFileSync(scriptPath, 'utf8');

        if (!replaceImport) {
            return source;
        }

        if (!alreadyImportScript) {
            alreadyImportScript = [script];
        }

        //rimpiazzo gli import
        let scriptWithImports = ``;
        const ptrn = new RegExp(/^[^\S\r\n]*import\s+".+$/, 'mg') //const ptrn = new RegExp(/^[^\S\r\n]*import\s+".+("|"\s*;|\s)$/mg)
        let match;
        while ((match = ptrn.exec(source)) != null) {
            //estraggo il nome dello script da importare
            const importedScriptName = match[0].substring(match[0].indexOf(`"`) + 1, match[0].lastIndexOf(`"`));

            //verifico se lo script è già stato importato, lo ignoro
            if (alreadyImportScript.indexOf(importedScriptName) > -1) {
                console.warn(`Script ${importedScriptName} multiple import found!`)
                continue;
            }
            alreadyImportScript.push(importedScriptName);

            //scarico lo script da importare
            const importedScriptSource = this.getScriptRawData(application, importedScriptName, true, alreadyImportScript);
            if (!importedScriptSource) {
                console.error(`Script ${importedScriptName} not found!`)
                throw new Error(`Script ${importedScriptName} not found!`);
            }

            scriptWithImports += `// ANACLETO IMPORTED SCRIPT: ${importedScriptName}\n${importedScriptSource}\n\n`;
        }

        //rimuovo la sintassi import "..."
        scriptWithImports += source.replace(ptrn, '');
        return scriptWithImports;
    }

    /**
     * Ritorna lo script e il suo sha in modo da poter fare il confronto in caso di modifica
     * @param {string} application 
     * @param {string} script 
     * @returns 
     */
    getScriptFile(application, script){
        const source = this.getScriptRawData(application, script);
        return {
            sha : fileUtils.getFileSha(source),
            source : source
        }
    }


    /**
     * Crea una finestra per l'applicazione passata
     * @param {*} application 
     * @param {*} id 
     * @param {*} scriptData 
     */
    createScript(application, user, id, scriptData) {

        if (!application || !id) {
            //la finestra esiste già
            return Promise.reject(new Error('missing script data'));
        }

        if (this.getScriptRawData(application, id)) {
            //la finestra esiste già
            return Promise.reject(new Error('script already exists'));
        }
        const scriptPath = this.getScriptRelativePath(id);
        return gitConnector.writeFile(application, user, scriptPath, scriptData);
    }

    /**
     * Crea una finestra per l'applicazione passata
     * @param {*} application 
     * @param {*} id 
     * @param {*} scriptData 
     * @param {*} clientSha SHA inviato dal client
     */
    updateScript(application, user, id, scriptData, clientSha) {

        if (!application || !id) {
            //la finestra esiste già
            return Promise.reject(new Error('missing script data'));
        }

        const source = this.getScriptRawData(application, id);
        if (!source) {
            //lo script non esiste
            return Promise.reject(new Error('script not exists'));
        }

        //check versione
        const serverSha = this.getFileSha(source);
        if(clientSha != serverSha){
            return Promise.reject(new Error('fail_sha'));
        }

        const scriptPath = this.getScriptRelativePath(id);
        return gitConnector.writeFile(application, user, scriptPath, scriptData);
    }


    /**
     * Crea una finestra per l'applicazione passata
     * @param {*} application 
     * @param {*} id 
     * @param {*} scriptData 
     */
    deleteScript(application, user, id, isDir) {

        if (!application || !id) {
            //la finestra esiste già
            return Promise.reject(new Error('missing script data'));
        }

        let scriptPathAbs;
        let scriptPathRel;
        if(isDir){
            scriptPathRel = path.join("scripts", id);;
            scriptPathAbs = path.join(appUtils.getAppFolder(application),"scripts", id);
        }else{
            scriptPathRel = this.getScriptRelativePath(id);
            scriptPathAbs = path.join(appUtils.getAppFolder(application), this.getScriptRelativePath(id));
        }


        if (!fs.existsSync(scriptPathAbs)) {
            //lo script non esiste
            return Promise.reject(new Error('script not exists'));
        }
        return gitConnector.deleteFile(application, user, scriptPathRel);
    }

    /**
     * Ritorna la lista di tutti gli script di una applicazione
     * @param {*} application 
     */
    list(application) {
        const appConfigration = appUtils.getAppConfiguration(application);
        if (!appConfigration) {
            console.error(`App ${application} not found in .env file`);
            return Promise.reject(`App ${application} not found`);
        }

        const scriptsPath = path.join(appUtils.getAppFolder(application), "scripts");
        const scripts = fileUtils.getAllFiles(scriptsPath);


        function hidePath(_list) {

            if (!_list) {
                return undefined;
            }

            let treeList = _list.map(function (file) {
                if (!file) {
                    return undefined;
                }

                if (file.isDir) {
                    hidePath(file.list || []);
                }

                return Object.assign(file, {
                    filePath: file.filePath.replace(scriptsPath, "")
                })
            });

            return treeList;
        }


        return Promise.resolve(hidePath(scripts));
    }


    /**
     * Oggetto da convertire in una stringa con funzioni
     * @param {Object} obj Oggetto da convertire 
     * @returns String
     */
    _stringifyJsonWithFunctions(obj) {
        if (!obj) {
            return obj;
        }

        //Preso un oggetto devo renderlo un JSON
        return JSON.stringify(obj, function (key, val) {
            if (typeof val == "function") {
                var body = val.toString();
                if (body.length < 8 || body.substring(0, 8) !== "function") {
                    return "_ArrFun_" + body;
                } else {
                    return "" + body;
                }
            } else {
                return val;
            }
        },4);
    }

    /**
     * Funzione per convertire stringa json con funzioni in oggetto
     * @param {String} json Stringa contenente funzioni
     * @param {Bool} date2obj Parametro per convertire la data da stringa a oggetto new Date
     * @returns Object
     */
    _parseJsonWithFunctions(json, date2obj) {
        if (!json) {
            return json;
        }

        return JSON.parse(json, function (key, val) {
            var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;
            var prefix;
            if (typeof val != "string") {
                return val;
            }
            if (val.length < 8) {
                return val;
            }
            prefix = val.substring(0, 8);
            if (iso8061 && val.match(iso8061)) {
                return new Date(val);
            }
            if (prefix == "function" || prefix == "_ArrFun_") {
                //Devo estrarre gli args e dividerli dal body
                var args = /\(\s*([^)]+?)\s*\)/.exec(val);
                if (args[1]) {
                    args = args[1].split(/\s*,\s*/);
                } else {
                    args = [];
                }
                var body = val.substring(val.indexOf("{") + 1, val.length - 1);
                var newFunct = new Function(args, body);
                return newFunct;
            }
            return val;
        })
    }
}

module.exports = new ScriptUtils();