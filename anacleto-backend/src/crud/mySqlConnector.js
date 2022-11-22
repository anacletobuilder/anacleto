/**
 * Docs: https://cloud.google.com/datastore/docs/reference/libraries
 * API: https://cloud.google.com/nodejs/docs/reference/datastore/latest/datastore/datastore
 */
const mysql = require("promise-mysql");

class MySqlConnector {
    poolCluster = null;

    constructor() {

    }

    init(dbsSettings) {
        console.info("Starting mysql pooler cluster...");

        mysql.createPoolCluster()
            .then(_poolCluster => {
                this.poolCluster = _poolCluster;
                console.info("Pooler cluster init");

                return Promise.all(
                    Object.keys(dbsSettings).map((_connectionName) => {
                        return this.poolCluster.add(_connectionName, dbsSettings[_connectionName])
                    })
                )

            })
            .then((db) => {
                console.info(`DB connected`, db);
            })
            .catch(e => {
                console.error(`Connection fail`, e);
            });
    }

    /**
     * @param {string} db
     * @param {sql,timeout,values} args 
     * @returns 
     */
    query(db, args) {
        let _connection;
        return this.poolCluster.getConnection(db)
            .then(connection => {
                _connection = connection;
                return connection.query(args);
            })
            .then((queryResult) => {
                _connection.release();
                return Promise.resolve(queryResult)
            })
            .catch(e => {
                return Promise.reject(e)
            });
    }


    /**
     * Ritorna la connessione al db indicato
     * @param {string} db 
     * @returns 
     */
    getConnection(db) {
        return this.poolCluster.getConnection(db);
    }

    /**
     * Escape an untrusted string to be used as a SQL value. Use this on user
     * provided data.
     * @param value Value to escape
     * @param stringifyObjects If true, don't convert objects into SQL lists
     * @param timeZone Convert dates from UTC to the given timezone.
     */
    escape(value, stringifyObjects, timeZone) {
        return mysql.escape(value, stringifyObjects, timeZone);
    }

    /**
     * Escape an untrusted string to be used as a SQL identifier (database,
     * table, or column name). Use this on user provided data.
     * @param value Value to escape.
     * @param forbidQualified Don't allow qualified identifiers (eg escape '.')
     */
    escapeId(value, forbidQualified) {
        return mysql.escapeId(value, forbidQualified);
    }
}

module.exports = MySqlConnector;