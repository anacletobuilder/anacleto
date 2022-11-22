
# Code

In Anacleto il tuo codice Javascript viene elaborato da **V8** 
>V8 is Google’s open source high-performance JavaScript and WebAssembly engine, written in C++. It is used in Chrome and in Node.js, among others. It implements ECMAScript and WebAssembly, and runs on Windows 7 or later, macOS 10.12+, and Linux systems that use x64, IA-32, ARM, or MIPS processors. V8 can run standalone, or can be embedded into any C++ application. [V8](https://v8.dev/)


In Anacleto puoi scrivere codice di 2 tipi:
- **client** tutti gli eventi che vengono eseguiti dal browser quando si verificano certi eventi
- **server** tutto il codice che viene eseguito dal server, ad esempio per caricare una griglia o per eseguire una query alla pressione di un tasto

## ES6
Anacleto supporta tutte le feature fornite da `ES6`, se non sai di cosa stiamo parlando dai una occhiata qui [ES6](https://www.w3schools.com/Js/js_es6.asp)

>Lo standard ES6 è uscito nel 2015, a già dal 2017 è ampiamente supportato da tutti i browser.

## Dichiarazione variabili

Anacleto supporta `var`, `let` e `const`, usale!
- le dichiarazioni con var  hanno ambito globale o di funzione, mentre le dichiarazioni con let e const hanno ambito di blocco.
- Le variabili var possono essere aggiornate o ri-dichiarate dentro il loro ambito; le variabili let possono essere aggiornate ma non re-dichiarate; le variabili const non possono essere né aggiornate né re-dichiarate.
- L'hoisting porta tutte le dichiarazioni in cima al loro ambito. Ma mentre le varabili var sono inizializzate con undefined, le variabili let e const non sono inizializzate.
- Mentre var e let possono essere dichiarate senza essere inizializzate, const deve essere inizializzato durante la dichiarazione.

## Lavorare con le stringhe

Con l'avvento di ES6 nel 2015 lavorare con le stringhe è diventato molto più facile.

Come facevi una volta:
```js
var nome = "Mario";
var cognome = "Rossi"
var messaggio = "Benvenuto " + nome + " " + cognome;

console.log(messaggio); // Benvenuto Mario Rossi
```

come potrai fare da oggi: 
```js
const nome = `Mario`;
const cognome = `Rossi`
const messaggio = `Benvenuto ${nome} ${cognome}`;

console.log(messaggio); // Benvenuto Mario Rossi
```

>**TIPS:** non sai come fare questo strano apice ` in un Mac? Ti basta premere AL+ BACKSLASH

## Localizzazione di numeri e date - Intl
Con l'avvento di ECMAScript tutti i moderni browser e NodeJS supportano l'utilizzo di `Intl`, questa nuova primitiva ti può aiutare molto nel formattare date e numeri.

>The Intl object is the namespace for the ECMAScript Internationalization API, which provides language sensitive string comparison, number formatting, and date and time formatting. The Intl object provides access to several constructors as well as functionality common to the internationalization constructors and other language sensitive functions.
[Intl doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

```js
//usare la lingua del browser
Intl.DateTimeFormat(navigator.language, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date()) // Friday, Dec 27

//specificare la lingua
Intl.DateTimeFormat("it", { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date()) // venerdì 19 ago

Intl.DateTimeFormat("en", { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date()) // Friday, Aug 19

```

```js
const number = 123456.789;

console.log(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number));
// expected output: "123.456,79 €"

// the Japanese yen doesn't use a minor unit
console.log(new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(number));
// expected output: "￥123,457"

// limit to three significant digits
console.log(new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number));
// expected output: "1,23,000"

```

>**TIPS:** non sbattere la testa nel definire tu i formati, lascia fare questo lavoro al browser!

## Date vs luxon
Lavorare con le date non è mai semplice, chiunque abbia lavorato in JS avrà sicuramente lottato con l'oggetto `Date`. Purtroppo questo oggetto è molto basilare e già solo fare il parse o la stampa di una data è una battaglia.


Per questo motivo con ECMAScript è stato introddo `Intl` che ci aiuta nella stampa.

Qualora questa primitiva non ti bastasse in Anacleto è possibile usare [luxon](https://moment.github.io/luxon/).
>Per chi non lo sapesse `luxon` è l'erede di `moment.js`, lo stesso team di `moment.js` consiglia il passaggio a `luxon`. Se non sai cos è `moment.js` ti basti sapere che è la libreria più usata nel pianeta quando bisogna lavorare con le date in Javascript :)

Di seguito alcuni esempi di come `luxon` può aiutarti, molte altre info le puoi torvare direttamente nella doc ufficiale:  [Doc luxon](https://moment.github.io/luxon/).

```javascript
//Esempio tipico cambio formato data
DateTime.fromSQL("2017-05-15").toFormat('yyyy LLL dd');

//creare una data
const dt = DateTime.local(2017, 5, 15, 8, 30);

//data corrente
const now = DateTime.now();

//data da un oggetto
dt = DateTime.fromObject({day: 22, hour: 12 }, { zone: 'America/Los_Angeles', numberingSystem: 'beng'})

//parse date 
DateTime.fromISO("2017-05-15")          //=> May 15, 2017 at midnight
DateTime.fromISO("2017-05-15T08:30:00") //=> May 15, 2017 at 8:30
DateTime.fromRFC2822("Tue, 01 Nov 2016 13:23:12 +0630");
DateTime.fromHTTP("Sunday, 06-Nov-94 08:49:37 GMT");
DateTime.fromHTTP("Sun, 06 Nov 1994 08:49:37 GMT");
//parse sql date
DateTime.fromSQL("2017-05-15");
DateTime.fromSQL("2017-05-15 09:24:15");
DateTime.fromSQL("09:24:15");
//parse timestamp
DateTime.fromMillis(1542674993410);
DateTime.fromSeconds(1542674993);
//formato custom
DateTime.fromFormat("May 25 1982", "LLLL dd yyyy");


//convertire data in una stringa
DateTime.now().toString(); //=> '2017-09-14T03:20:34.091-04:00'
dt.toISO(); //=> '2017-04-20T11:32:00.000-04:00'
dt.toISODate(); //=> '2017-04-20'
dt.toISOWeekDate(); //=> '2017-W17-7'
dt.toISOTime(); //=> '11:32:00.000-04:00'
dt.toMillis(); //=> 1492702320000
dt.toSeconds(); //=> 1492702320.000
dt.valueOf(); //=> 1492702320000, same as .toMillis()
dt.toLocaleString(); //=> '4/20/2017'
dt.toLocaleString(DateTime.DATETIME_FULL); //=> 'April 20, 2017, 11:32 AM EDT'
dt.setLocale('fr').toLocaleString(DateTime.DATETIME_FULL); //=> '20 avril 2017 à 11:32 UTC−4'
dt.toFormat('yyyy LLL dd');

//operazioni matematiche
var dt = DateTime.now();
dt.plus({ hours: 3, minutes: 2 });
dt.minus({ days: 7 });
dt.startOf('day');
dt.endOf('hour');

//proprietà
dt = DateTime.now();
dt.year     //=> 2017
dt.month    //=> 9
dt.day      //=> 14
dt.second   //=> 47
dt.weekday  //=> 4
dt.zoneName     //=> 'America/New_York'
dt.offset       //=> -240
dt.daysInMonth  //=> 30
```

## Promise
In Anacleto tutti i metodi asincroni lavorano usando le `Promise`, altrimenti è un attimo finire nel tanto temuto `callback hell`...se non sai di cosa stiamo parlando documentati un po' su Google.

Di seguto alcuni esempi di script che usano le promise.

- In uno script puoi usare `await` per attendere l'esito di una promise. Non preoccuparti, l'await non blocca l'applicativo perchè il tuo script è lanciata all'interno di una funzione `async`
```js
const queryArgs = {
    db: "MASTER",
    sql: "select id from table"
}
const ret = await mysql.query(queryArgs);
//work with ret
console.log(ret);
const myRet = ret.map(row =>{
    return row.id
})
return myRet;
```

- Usa i then e i catch per gestire le funzioni asincrone
```js
const queryArgs = {
    db: "MASTER",
    sql: "select id from table"
}
return mysql.query(queryArgs)
    .then((res) => {
        //work with ret
        console.log(ret);
        return new Promise((resolve, reject) => {
            const myRet = ret.map(row =>{
                return row.id
            })
            resolve(myRet);
        });
    });
```

- Modo compatto
```js
const queryArgs = {
    db: "MASTER",
    sql: "select id from table"
}
return mysql.query(queryArgs)
    .then((res) => {
        //work with ret
        console.log(ret);
        const myRet = ret.map(row =>{
            return row.id
        })
        return Promise.resolve(myRet);
    });
```

- E quando le cose si fanno serie
```js

let query1Res = [];
let query2Res = [];

return mysql.query(args1)
    .then((res) => {
        query1Res = res;
        //work with res
        return  mysql.query(args2);
    })
    .then((res) => {
        query2Res = res;
        //work with res
        return Promise.resolve(res);
    })
    .catch((error) => {
        query2Res = res;
        //work with res
        return Promise.resolve(res); //or reject
    })
```

# Documentazione

- [Frontend Docs](code_client.md)
- [Backend Docs](code_server.md)