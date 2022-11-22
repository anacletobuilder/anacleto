/**
 * Classe di utilità per esegurei codice JS
 * 
 */
const scriptUtils = require("../utils/scriptutils");
const logger = require('../utils/logger');

class ScriptEvaluator {

    /**
     * Esegue lo script JS specificata in un contesto separato da quello del NodeJS dove gira l'applcazione.
     * E' importante che questo script sia isolata dal NodeJS in modo che l'utente possa accedere solo alle funzionalità messe a disposizione da questa classe
     * 
     * @param {object} req richiesta POST/GET fatta
     * @param {string} script codice js da eseguire
     * 
     * @return {Promise} ritorna una promise con l'esito dello script
     */
    processJS({ mySqlConnector, datastoreConnector }, req, script) {

        let ret;
        const vm = require('vm');
        const userUtils = require("../utils/userUtils");
        const windowUtils = require("../utils/windowUtils");
        const roleUtils = require("../utils/roleUtils");
        const metadataUtils = require("../utils/metadataUtils");
        const scriptUtils = require("../utils/scriptutils");
        const { DateTime } = require("luxon");
        const { v4: uuidv4 } = require('uuid');


        //contesto da passare allo script
        const contextObject = {
            req: req,
            application: req.headers.application, //TODO passare l'oggetto user ecc
            logger: logger, //passo direttamente tutta l'interfaccia logger
            DateTime: DateTime, //classe di utilità per le date
            console: {
                log: (...args) => {
                    //default metot info, perchè logger.log si aspetta il livello
                    console.info(...args);
                },
                info: (...args) => {
                    console.info(...args);
                },
                warn: (...args) => {
                    console.warn(...args)
                },
                error: (...args) => {
                    console.error(...args);
                }
            },
            utils: {
                uuid: () => {
                    return uuidv4();
                }
            },
            googleDatastore: {
                getEntity(params) {
                    return datastoreConnector.getEntity(params)
                    .then(resp => {
                        /**
                         * resp contiene 2 elementi
                         * 0: [array]
                         */
                        return Promise.resolve(resp);
                    });
                },
                insertEntity(params) {
                    return datastoreConnector.insertEntity(params);
                },
                updateEntity(params) {
                    return datastoreConnector.updateEntity(params);
                },
                deleteEntity(params) {
                    return datastoreConnector.deleteEntity(params);
                },
                list(params) {
                    if (params.pagination && req.headers.pagefirst >= 0 && req.headers.pagerows > 0) {
                        params.limit = req.headers.pagerows;
                        params.offset = parseInt(req.headers.pagefirst) * parseInt(req.headers.pagerows);
                    }
                    return datastoreConnector.list(params)
                        .then(resp => {
                            /**
                             * resp contiene 2 elementi
                             * 0: [array]
                             * 1: {moreResult, endCursor
                             */
                            if (params.pagination) {
                                return Promise.resolve({ rows: resp[0], hasMoreRows: resp[1]?.moreResults === "MORE_RESULTS_AFTER_LIMIT" });
                            }

                            return Promise.resolve({ rows: resp[0] });
                        });
                }
            },
            mysql: {
                query(params) {

                    const args = {
                        sql: params.sql,
                        timeout: params.timeout,
                        values: params.values,
                        nestTables: params.nestTables,
                    };

                    if (params.pagination && req.headers.pagefirst >= 0 && req.headers.pagerows > 0) {
                        //aggiungo la paginazione
                        args.sql += ` limit ${parseInt(req.headers.pagefirst) * parseInt(req.headers.pagerows)},${parseInt(req.headers.pagerows) + 1}`
                    }

                    return mySqlConnector.query(params.db, args)
                        .then(rows => {
                            if (params.pagination) {
                                const hasMoreRows = rows.length === parseInt(req.headers.pagerows) + 1;
                                if (rows.length > req.headers.pagerows) {
                                    rows.pop();
                                }
                                return Promise.resolve({ rows: rows, hasMoreRows: hasMoreRows });
                            }

                            return Promise.resolve({ rows: rows });
                        });
                },
                getConnection(params) {
                    return mySqlConnector.getConnection(params.db);
                },
                escape(value, stringifyObjects, timeZone) {
                    return mySqlConnector.escape(value, stringifyObjects, timeZone);
                },
                escapeId(value, forbidQualified) {
                    return mySqlConnector.escapeId(value, forbidQualified);
                },
                transactionBlock: async (connectionName, txBody) => {
                    let success = true;
                    const db = await mySqlConnector.getConnection(connectionName);
                    await db.beginTransaction();
                    try {
                        await txBody(db);
                        db.commit(); // all good, commit
                    } catch (err) {
                        console.error("transactionBlock error ", err);
                        await db.rollback();
                    }
                    await db.release();

                    if (success) {
                        return Promise.resolve({ sucess: true });
                    }
                    return Promise.reject({ sucess: false });

                }
            },
            users: {
                list: function (params) {
                    return userUtils.listUsers(params ? params.nextToken : null);
                },
                get: function (params) {
                    return userUtils.getUser(params ? params.uid : null);
                },
            },
            windows: {
                list: function (params) {
                    return windowUtils.list(params.application);
                }
            },
            scripts: {
                list: function (params) {
                    return scriptUtils.list(params.application);
                }
            },
            roles: {
                list: function (params) {
                    const source = roleUtils.getRoleRawData(params.application);
                    const allRoles = JSON.parse(source);

                    //TODO se è ADMIN mostrare tutti i ruoli, altrimenti filtrare..
                    //      oppure fare il ruolo IAM_ADMIN ? stile google

                    return allRoles;
                }
            },
            metadata: {
                get: function (params) {
                    return metadataUtils.getMetadataRawData(params.application);
                },
                _parseJsonWithFunctions: function (params) {
                    return scriptUtils._parseJsonWithFunctions(params.string);
                },
                _stringifyJsonWithFunctions: function (params) {
                    return scriptUtils._stringifyJsonWithFunctions(params.object);
                },
            }
        };

        /**
         * Docs: https://nodejs.org/docs/latest/api/vm.html#vmruninnewcontextcode-contextobject-options
         * Docs: https://nodejs.org/docs/latest/api/vm.html#vm_vm_runinthiscontext_code_options
         * Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
         * 
         * Script JS potrebbe usare delle promise al suo interno, per questo motivo la inglobo dentro una funzione async().
         * In questo modo si possono usare tranquellamente gli await.
         * 
         * @return: il sistema si aspetta che la funzione ritorni una promise
         */

        const finalScript = `(async() => {\n${script}\n})();`;

        try {

            var options = {
                timeout: 60000, //todo... test only
                //microtaskMode: 'afterEvaluate'
            };

            return vm.runInNewContext(finalScript, contextObject, options)
                .catch(e => {
                    this.printJSError(finalScript, e);
                    ret = {
                        success: false
                    }
                    throw e;
                });

        } catch (e) {
            this.printJSError(finalScript, e);
            ret = {
                success: false
            }
        }

        return Promise.reject(new Error(ret));;
    }

    /**
     * Stampa in modo ordinato il log di errore di uno script
     * 
     * @param {string} actionsource sorgente dello script
     * @param {object} error errore tornato da runInNewContext
     */
    printJSError(actionsource, error) {
        const actionSourceWithNumber = actionsource.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
        const errorMessage = (`\nJS ERROR\n${error.message || error}\n${error.stack}\n\n${actionSourceWithNumber}`);
        console.error(errorMessage)
    }
}

module.exports = new ScriptEvaluator(); //istanza singola