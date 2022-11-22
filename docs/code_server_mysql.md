# MySql
Anacleto fornisce le funzioni di utilità per collegarsi a MySql.

## mysql.query
Esegui le tue query effettuando l'autocommit non appena la query viene eseguita.

Il metodo accetta come input:
- `db` nome del db su cui esegure la query
- `sql` query da eseguire
- `timeout` opzionale, timeout query
- `values` opzionale, valori da passare nella query

```js
const queryArgs = {
    db: "MASTER",
    sql: "select id from table where name = ?",
    values: ["PIPPO"]
}
const ret = await mysql.query(queryArgs);
```


Different value types are escaped differently, here is how:

- Numbers are left untouched
- Booleans are converted to true / false
- Date objects are converted to 'YYYY-mm-dd HH:ii:ss' strings
- Buffers are converted to hex strings, e.g. X'0fa5'
- Strings are safely escaped
- Arrays are turned into list, e.g. ['a', 'b'] turns into 'a', 'b'
- Nested arrays are turned into grouped lists (for bulk inserts), e.g. [['a', 'b'], ['c', 'd']] turns into ('a', 'b'), ('c', 'd')
- Objects that have a toSqlString method will have .toSqlString()called and the returned value is used as the raw SQL.
- Objects are turned into key = 'val' pairs for each enumerable property on the object. If the property's value is a function, it is skipped; if the property's value is an object, toString() is called on it and the returned value is used.
undefined / null are converted to NULL
- NaN / Infinity are left as-is. MySQL does not support these, and trying to insert them as values will trigger MySQL errors until they implement support.

## Joins con nomi colonne che si accavallano
https://github.com/mysqljs/mysql#joins-with-overlapping-column-names

Es 1

```js
var options = {sql: '...', nestTables: true};
```

```json
[{
    table1: {
      fieldA: '...',
      fieldB: '...',
    },
    table2: {
      fieldA: '...',
      fieldB: '...',
    },
  }, ...]
```

Es 2

```js
var options = {sql: '...', nestTables: '_'};
```

```json
[{
    table1_fieldA: '...',
    table1_fieldB: '...',
    table2_fieldA: '...',
    table2_fieldB: '...',
  }, ...]
```


## Paginazione
Se la tua query è collegata alla store di una griglia e vuoi che sia paginata devi specificarlo attraverso la proprietà `pagination`, la query si aadattare al setup della griglia.
```js
const queryArgs = {
    db: "MASTER",
    sql: "select id from table where name = ?",
    values: ["PIPPO"],
    pagination : true
}
const ret = await mysql.query(queryArgs);
```


## Examples

 - Object insert
```js
const queryArgs = {
    db: "MASTER",
    sql: 'INSERT INTO posts SET ?',
    values: {id: 1, title: 'Hello MySQL'};
}

connection.query(queryArgs);
// INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
```

- Custom toSqlString
```js
const CURRENT_TIMESTAMP = {
     toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } 
};
const queryArgs = {
    db: "MASTER",
    sql: 'UPDATE posts SET modified = ? WHERE id = ?',
    values:[CURRENT_TIMESTAMP, 42]
}

connection.query(queryArgs);
//UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42
```

- Escape. If you feel the need to escape queries by yourself, you can also use the escaping function directly:


```js
var query = "SELECT * FROM posts WHERE title=" + mysql.escape("Hello MySQL");
```


- Escape Id. If you can't trust an SQL identifier (database / table / column name) because it is provided by a user, you should escape it with mysql.escapeId(identifier), connection.escapeId(identifier) or pool.escapeId(identifier) like this:

```js
var sql    = 'SELECT * FROM posts ORDER BY ' + mysql.escapeId(sorter);

```

- Identificatori parametrici
```js
var userId = 1;
var columns = ['username', 'email'];
const queryArgs = {
    db: "MASTER",
    sql: 'SELECT ?? FROM ?? WHERE id = ?',
    values:[columns, 'users', userId]
}
mysql.query(queryArgs);
// SELECT `username`, `email` FROM `users` WHERE id = 1
```

- Transaction block: puoi usare il codice seguente per esegure il codice all'interno di una trasazione. Nel caso si verifichi un errore (es throw) il sistema effettuerà una roolback, altrimenti verrà affettuato il commit
```js
console.info("AZIONE START INSERT");

var resp = await mysql.transactionBlock("ASPORTO", async (_db) => {

    //le query in questo blocco saranno tutte eseguite all'interno della stessa transazione

    console.info("Start transaction");

    const queryArgs = {
        db: "ASPORTO",
        sql: 'INSERT INTO asporti SET ?',
        values: {
            id: utils.uuid(), 
            user_description: "Mario Rossi",
            user_image: "icon.png",
            note: "note bla bla",
            create_date: DateTime.now(),
            update_date: null,
            user_id_create: req.user.email,
            user_id_update: null
        }
    }

    console.info("Do insert");
    var insertRes = await _db.query(queryArgs);
});

console.info("Commit ok");

return {success:true}
``` 

- Transazioni manuali: se preferisci puoi gestire manualemente le transazioni. **NB** va gestito il catch in cui si rilascia la connessione
```js
console.info("AZIONE 2 START");
const dbAsporto = await mysql.getConnection({ db: "ASPORTO" });

try{
    console.info("AZIONE START TRANSACATION");
    await dbAsporto.beginTransaction();

    const queryArgs = {
        db: "ASPORTO",
        sql: 'INSERT INTO asporti SET ?',
        values: {
            id: utils.uuid(), 
            user_description: "Mario Rossi",
            user_image: "icon.png",
            note: "note bla bla",
            create_date: DateTime.now(),
            update_date: null,
            user_id_create: req.user.email,
            user_id_update: null
        }
    }

    console.info("AZIONE START INSERT");
    var insertRes = await dbAsporto.query(queryArgs);

    console.info("AZIONE START COMMIT");
    await dbAsporto.commit();
}catch(e){
    await dbAsporto.roolback();
}finaly{
    console.info("RILASCIA CONNESSIONE");
    await dbAsporto.release();
}

console.info("AZIONE 2 FINE");
return {success: true, message : insertRes}

```


## mysql.getConnection
Chiede al pooler una connessione al db.
Per sapere cosa puoi fare con una connessione consulta la doc ufficiale della libreria npm di mysql [mysql](https://github.com/mysqljs/mysql)
```js
console.info("AZIONE 2 START");
const dbAsporto = await mysql.getConnection({ db: "ASPORTO" });
```

## mysql.escape
Esegue l'escape di stringhe, utile se hai bisogno di concatenare valori passato dal clienti [mysql](https://github.com/mysqljs/mysql).
```js
var query = "SELECT * FROM posts WHERE title=" + mysql.escape("Hello MySQL");
```

## mysql.escapeId
Esegue l'escape di identificatori, utile se hai bisogno di concatenare identificatori passato dal clienti [mysql](https://github.com/mysqljs/mysql).
```js
var sql    = 'SELECT * FROM posts ORDER BY ' + mysql.escapeId(sorter);

```