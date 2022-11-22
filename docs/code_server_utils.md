# Logging

Anacleto salva i log dei tuoi script in file a rotazione usando il formato `json`.

È possibile accedere alle funzionalità di log sia usando la classe `console` che quella `logger`.

Entrambe le funzionalità danno accesso ai metodi `log`, `info`, `warn`, `error` tutti questi metodi consentono di passare un numero variabile di attributi e si arrangeranno loro a creare un log formattato come si deve.

**NB: ti sconsiblio di metterti a concatenare le stringhe, lascia fare al logger il suo lavoro!**

Di seguito un esempio:

```js
const resp = {success: true, data : [1,2,3]}
logger.log(`Resp`, resp);
```
log sulla console:
```
Resp {success:true,data:[1,2,3]}
```

Come si può vedere dall'esempio si la funzione `log` capisce che il secondo parametro è un oggetto e fa lo stringify.

## logger.log
Stampa log di livello info.
## logger.info
Stampa log di livello info.
## logger.warn
Stampa log di livello warning.
## logger.error
Stampa log di livello error.