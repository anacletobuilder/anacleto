# Server

Gli script js lato server vengono eseguite all'interno di una funziona asincrona, supportano l'utilizzo di `await` e posso ritornare qualsiasi valore javascript o una `Promise`.

>**NB:** non sei obbligato a tornare una stringa, si arrangerà il server a ritornare il dato con il content type corretto.

Di seguito alcuni esempi:

## Script che ritorna un json
```js
const x = {success: false, someData = [1,2,3]}
return x;
```

## Lavorare con le Promise
Una script lato server può tornare direttamente una promise, si occupa Anacleto di gestire il `then`
```js
const queryArgs = {
    db: "MASTER",
    sql: "select id from table"
}
return mysql.query(queryArgs);
```

Se non sai di cosa si tratta consulta la sezione dedicata: 
[Anacleto & Promise](code.md)

# Organizzazione script
In Anacleto puoi ragruppare gli script in cartelle, usa questa feature per organizzare e ordinare al meglio il tuo codice. 
>**May the force be with you**

# Import
In uno script lato server puoi usare la parola chiave `import` per importare un altro script. Questa feature ritorna particolarmente comoda tutte le volte che hai del codice che vuoi riutilizzare.

>Non preoccuparti se alcuni script importano gli stessi script o se alcuni script si importano a vicenza. Anacleto gestirà per te le dipendendenze evitando di importare ricorsivamente più volte lo stesso script.

>Ricorda che in Anacleto puoi organizzare i tuoi script in cartelle e puoi fare più import. Combina queste 2 feature per scrivere codice pulito non duplicato, e ben organizzato.

```js
import "utils/utils1";
import "utils/utils2"
import "asporti/insert_utils";

//your code...

return {success:true}

```


# Moduli disponibili lato server
Anacleto supporta alcuni moduli aggiuntivi, eccoli di seguito:
- [Utils](code_server_utils.md)
- [Logger](code_server_logger.md)
- [MySql](code_server_mysql.md)
- [Google Datastore](code_server_datastore.md)