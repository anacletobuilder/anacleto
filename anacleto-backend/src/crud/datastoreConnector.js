/**
 * Docs: https://cloud.google.com/datastore/docs/reference/libraries
 * API: https://cloud.google.com/nodejs/docs/reference/datastore/latest/datastore/datastore
 */
const { Datastore } = require('@google-cloud/datastore');
require('dotenv').config({ path: __dirname + '/../../../.env' });
console.log(`loading process...`);
const { env } = require('process');

class DatastoreConnector {

    constructor() { 
        try {
			if(!env.DATASTORE_SETTINGS){
				throw "No DATASTORE_SETTINGS property found in .env";
			}
            const datastoreSettings = JSON.parse(env.DATASTORE_SETTINGS);
            const datastore = new Datastore({
                projectId: datastoreSettings.projectId,
                credentials: datastoreSettings

            });
            this.datastore = datastore;

            if (datastoreSettings.namespace) {
                this.datastore.namespace = datastoreSettings.namespace;
            }
        }catch (e) {
            console.error(e);
        }
        
    }

    /**
     * Insert an object on Google Datastore
     * @param {String} params - 
     * @param {String} params.entityName name of the entity
     * @param {Object} params.entity entity to insert
     * @param {Object} params.entityAttributes map attribute-type
     *                   var entityAttributes = {
                            name: {
                                type: "string",
                                isPk:true //Se non specificato, usa la chiave automatica
                            },
                            createDate: {
                                type: "date"
                            }
                        };
     */
    insertEntity(params) {

        //recupero la pk dagli attributi
        let entityKey;
        for (const [key, value] of Object.entries(params.entityAttributes)) {
            if(value.isPk){
                entityKey = params.entity[key];
                //TODO è la gestione migliore??
                delete params.entityAttributes[key]; //non voglio questo attributo, sarà già l'id 
                break;
            }
        }

        //costruisco la key per il datastore, se specificato un campo isPk uso quello, altrimenti usa il default
        const key = entityKey ? this.datastore.key([params.entityName, entityKey]) : this.datastore.key(params.entityName);
        if (this.namespace) {
            key.namespace = this.namespace
        }
        /*
        const key = entityKey ?
            this.datastore.key({
                //TODO namespace: 'my-namespace',
                path: [entityName, entityKey]
            }) :
            this.datastore.key({
                //TODO namespace: 'my-namespace',
                path: [entityName]
            });
        */

        /*
        Es:
        const entityObj = {
            key: entityKey,
            data: [
                {
                    name: 'created',
                    value: new Date().toJSON(),
                },
                {
                    name: 'description',
                    value: description,
                    excludeFromIndexes: true,
                },
                {
                    name: 'done',
                    value: false,
                },
            ],
        };
        */

        const entityObj = {
            key: key,
            data: {},
            excludeFromIndexes: []
        };

        for (var attr in params.entityAttributes) {
            if (params.entityAttributes.hasOwnProperty(attr) && params.entity[attr]) {

                if (!params.entity[attr]) {
                    entityObj.data[attr] = null;
                } else {
                    switch (params.entityAttributes[attr].type) {
                        case 'date':
                            entityObj.data[attr] = new Date(params.entity[attr]).toJSON();
                            break;
                        default:
                            entityObj.data[attr] = params.entity[attr];
                            break;
                    }
                }

                if (params.entityAttributes[attr].excludeFromIndexes) {
                    entityObj.excludeFromIndexes.push(attr);
                }
            }
        }

        /* vesione ascync, togli async da function sopra
        this.datastore.save(entityObj, (err) => {
            console.log(key.path); // ['Company', 'donutshack']
            console.log(key.namespace); // 'my-namespace'
        });
        */
        return this.datastore.save(entityObj);
    }

    /**
     * Update an object on Google Datastore 
     * @param {Map} params - Parameters passed to function.
     * @param {string} params.entityName - name of the entity.
     * @param {string} params.entityKey - key of the entity.
     * @param {Map} params.entity - entity to update.
     * @param {Map} params.entityAttributes - map attribute-type.
     * @param {Boolean} params.forceNullFields - indicates if force to null the fields if not passed.
     */
    updateEntity(params) {
        const transaction = this.datastore.transaction();
        //const entityKey = datastore.key(['Task', datastore.int(taskId)]);
        const key = this.datastore.key([params.entityName, params.entityKey]);

        return transaction.run()
            .then(() => transaction.get(key))
            .then((result) => {
                const entity = result[0];
                let excludeFromIndexes = [];

                for (attr in params.entity) {
                    if (params.entity.hasOwnProperty(attr) && (params.forceNullFields || params.entity[attr])) {
                        
                        switch (entityAttributes[attr].type) {
                            case "date":
                                entity[attr] = new Date(params.entity[attr])
                                break;
                            default:
                                entity[attr] = params.entity[attr];
                                break;
                        }
                    }
                }
                
                for(attributes in params.entityAttributes) {
                    if(params.entityAttributes.hasOwnProperty(attributes) && 
                        params.entityAttributes[attributes]) {
                            excludeFromIndexes.push(attributes);
                        }
                }

                transaction.save({
                    key: key,
                    data: entity,
                    excludeFromIndexes: excludeFromIndexes
                });

                return transaction.commit();
            })
            .catch(() => transaction.rollback());
    }

    deleteEntity(params) {
        const key = this.datastore.key([params.entityName, params.entityKey]);
        return this.datastore.delete(key);
    }

    getEntity(params) {
        const key = this.datastore.key([params.entityName, params.entityKey]);
        return this.datastore.get(key)
        .then(resp => {
            return Promise.resolve(this.addEntityKeyAttribute(resp[0]));
        })
        // entity = {
        //   category: 'Personal',
        //   done: false,
        //   priority: 4,
        //   description: 'Learn Cloud Datastore',
        //   [Symbol(KEY)]:
        //    Key {
        //      namespace: undefined,
        //      id: '...',
        //      kind: 'Task',
        //      path: [Getter]
        //    }
        //   }
        // };
    }
    /**
     * 
     * @param {Object} params 
     * @param {String} entityName
     * 
     * @returns 
     */
    list(params) {
        if(!params.limit){
            //non te lo metto io, ma un limit me lo devi passare :)
            throw "Please specify a limit for Google Dastore query! :)"
        }

        const query = this.datastore.createQuery(params.entityName);
        if(params.select) {
            query.select(params.select);
        }
        if(params.filters){
            for(let i in params.filters) {
                let filter = params.filters[i];
                if(filter.operator) {
                    query.filter(filter.property,filter.operator,filter.value);
                }else {
                    query.filter(filter.property,filter.value);
                }
            }
        }
        if(params.order) {
            query.order(params.order.property, {descending: params.order.descending});
        }
        if(params.limit) {
            query.limit(params.limit);
        }
        if(params.offset) {
            query.offset(params.offset);
        }
        return query.run()
        .then(resp => {
            resp[0].forEach(entity => {
                this.addEntityKeyAttribute(entity)
              });
            return Promise.resolve(resp);
        });
    }

    /**
     * Aggiunge l'attributo __KEY__ alla entità di DS
     * @param {Object} entity 
     */
    addEntityKeyAttribute(entity){
        if(entity){
            entity.__KEY__ = entity[this.datastore.KEY];
        }
        return entity;
    }

}

module.exports = DatastoreConnector;