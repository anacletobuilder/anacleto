# Google Datastore
Anacleto fornisce le funzioni di utilità per collegarsi a Google Datastore

Tutte le entità recuperate da datastore contengo la proprietà `__KEY__`, un oggetto dal quale recuperare la chiave dell'entità.

## Get entity
Se vuoi recuperare un entità da Datastore. 

Il metodo accetta in input `params`, all'interno del quale puoi definire:
- `entityName` nome del gruppo entità di Datastore
- `entityKey` chiave dell'entità nella tabella

Il metodo restituisce una Promise.

Esempio:
```js
const getParams = {
    entityName: "MASTER",
    entityKey: "PIPPO"
}
const ret = googleDatastore.getEntity(getParams)
    .then((res) => {
        //Logiche per success true o false
    })
    .catch((err) => {
        //Logica per catch dell'errore
    });
```

## Insert entity

Se vuoi inserire un entità in un gruppo entità Datastore

Il metodo accetta in input `params`, all'interno del quale puoi definire:
- `entityName` nome del gruppo entità di Datastore
- `entity` entità da salvare
- `entityAttributes` Mappa campo - tipo attributo

Il metodo restituisce una Promise.

Esempio:
```js
const insertPars = {
    entityName: "MASTER",
    entity: {
        "name": "PIPPO",
        "createDate": "2022-09-08 00:00:00"
    },
    entityAttributes: {
        name: { 
            type: "string",
            isPk: true 
        },
        createDate: { 
            type: "date"
        }
    }
}
const ret = googleDatastore.insertEntity(insertPars)
    .then((res) => {
        //Logiche per success true o false
    })
    .catch((err) => {
        //Logica per catch dell'errore
    });
```

## Update entity
Se vuoi aggiornare un entità in un gruppo entità Datastore

Il metodo accetta in input `params`, all'interno del quale puoi definire:
- `entityName` nome del gruppo entità di Datastore
- `entityKey` chiave dell'entità da aggiornare
- `entityObj` entità da salvare
- `entityAttributes` Mappa campo - tipo attributo 
- `forceNullFields` forza campi già esistenti a null se non passati

Il metodo restituisce una Promise.

Esempio: 
```javascript
const updatePars = {
    entityName: "MASTER",
    entityKey: "PIPPO",
    entityObj:{
        "name": "PIPPO",
        "createDate": "2022-09-08 00:00:00",
        "lastUpdate": "2022-09-15 00:00:00"
    },
    entityAttributes: {
        name: { 
            type: "string",
            isPk: true 
        },
        createDate: { 
            type: "date"
        },
        lastUpdate: { 
            type: "date"
        }
    },
    forceNullFields: false
};
const ret = googleDatastore.updateEntity(updatePars)
    .then((res) => {
        //Logiche per success true o false
    })
    .catch((err) => {
        //Logica per catch dell'errore
    });
```

## Delete entity
Se vuoi eliminare un entità in un gruppo entità Datastore.

Il metodo accetta in input `params`, all'interno del quale puoi definire:
- `entityName` nome del gruppo entità di Datastore
- `entityKey` chiave dell'entità da aggiornare

Il metodo restituisce una Promise.

Esempio:
```js
const deletePars = {
    entityName: "MASTER",
    entityKey: "PIPPO"
}
const ret = googleDatastore.deleteEntity(deletePars)
    .then((res) => {
        //Logiche per success true o false
    })
    .catch((err) => {
        //Logica per catch dell'errore
    });
```

## List entity
Se vuoi ricercare delle entità in un gruppo entità Datastore.

Il metodo accetta in input `params`, all'interno del quale puoi definire:
- `select` campi che deve estrarre dalle entità che trova
- `entityName` nome del gruppo entità in cui cercare
- `filters` array di oggetti per effetturare il filtro di ricerca contentente oggetti con le seguenti proprietà:
  - `property` nome del campo da filtrare
  - `value` valore da utilizzare nel filtro
  - `operator` (OPZIONALE) indica l'operatore da usare nella ricerca, se non passato si utilizza  l'operatore `=`
- `order` oggetto in cui viene definito per quale campo effettuare l'ordinamento
  - `property` nome del campo da utilizzare per effettuare ordinamento
  - `descending` valore booleano per indicare se ordinamento decrescente (true) o ascendente(false), se non passato si intende ordinamento acendente
- `limit` numero di valori che si vuole recuperare con la ricerca
- `offset` numero di valori dopo i quali iniziare la ricerca 

Il metodo restituisce una Promise:
>**ATTENZIONE:** Nel caso in cui la query ricerchi solamente alcuni campi o nel caso in cui siano necessari degli ordinamenti, sarà necessario creare degli indici: se sei curioso di capire come funzionino verifica qui: [Indici](https://cloud.google.com/datastore/docs/concepts/indexes). Se invece hai già iniziato ad utilizzarli e vuoi capire come ottimizzarli: [Ottimizzazione degli indici](https://cloud.google.com/datastore/docs/concepts/optimize-indexes)

Esempio - Restituire i primi 10 risultati: 
```js
    const pars = {
        "entityName": "MASTER",
        "limit": 10
    }
    const res = googleDatastore.list(pars)
        .then((res) => {
            //Logiche per success true o false
        })
        .catch((err) => {
            //Logica per catch dell'errore
        });
```

Esempio - Restituire i primi 10 risultati ordinati per data creazione descrescente: 
```js
    const pars = {
        "entityName": "MASTER",
        "limit": 10,
        "order": {
            "property": "createDate",
            "descending": true
        }
    }
    const res = googleDatastore.list(pars)
        .then((res) => {
            //Logiche per success true o false
        })
        .catch((err) => {
            //Logica per catch dell'errore
        });
```
