# Form

## Layout
Quando crei una pannello puoi scegliere tra 2 tipi di layout, usando la proprietà `layout`
* grid
* flex

Se non viene specificata acluna proprietà verrà usato il valore di default `grid`

Oltre al layout puoi aggiungre al pannello classi aggiuntive usando l'attributo `classNames`, `labelClassName`, `fieldClassName`

Infine puoi usare `style` e passare un oggetto con gli style che vuoi mettere in linea.

## grid layout
```
"layout" : "grid"
```
Quando utilizzi il layout grid Anacleto è completamente autonomo nel disporre i pannelli all'interno di un form, la sola cosa che devi fare è dare un peso **da 1 a 12** ai pannelli.
> Se un peso non viene specificato di default il valore è 12.

Il peso di un pannello va specificato tramite la proprietà `colNumber` utilizzando le classi apposite `col-1`,`col-2` ... `col-12`.

Se ne hai la necessuità puoi definire un peso diverso per schermi diversi, per farlo utilizza i prefissi:
- sm
- md
- lg
- xl


Immagina lo schermo diviso in 12 colonne, nell'esempio di seguito la larghezza del pannello sarà di default 12 (l'intera larghezza dello schermo).
Negli schermi di medie dimensioni il pannello occuperà 8 colonne (2/3 dello schermo), mentre degli schermi grandi (o molto grandi) grandi il pannello occuperà 6 colonne di 12 (ossia metà schermo).
```
"colNumber" : "col-12 md:col-8 lg:col-6"
```

>**TIPS:**  Questa tecnica delle 12 colonne è largamente utilizzata da molti anni per creare applicazioni responsive. Se sei curioso indaga un po' nel web

In aggiunta alla proprietà `colNumber` puoi utilizzare `classNames` per aggiungere al tuo pannello le classi che più desideri separata da spazio.

## flex system
```
"layout" : "flex"
```
Flex, flex e ancora flex...se non sa di cosa stiamo parlando documentati qui [Docs](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) - [Video](https://www.youtube.com/watch?v=IDDK6sX003Q)

Se vuoi essere libero di disegnare una finestra a tuo piacimaneto imposta l'attributo della finestra `layout=flex`, da questo momento in poi sarai libero di posizionare i pannelli come desideri utilizzando la proprietà `classNames`

Quando utilizzi il layout `flex` Anacleto di mette a disposizione alcune classi che possono aiutarti nel posizionare un pannello

- `flex-auto` imposta `flex: 1 1 auto;`
- `flex-1` imposta `flex: 1 1 0% !important;` utile quando vuoi dare peso 1 a un pannello (se metti 3 pannelli con flex 1 saranno tutti e 3 larghi uguali)
- `flex-2` imposta `flex: 2 2 0% !important;` utile quando vuoi dare peso 2 a un pannello (sarà sempre largo il doppio di un pannello con flex 1)
- `flex-grow-0`	imposta `flex-grow: 0;`
- `flex-grow-1`	imposta `flex-grow: 1`
- `flex-shrink-0` imposta `flex-shrink: 0;`
- `flex-shrink-1`imposta `flex-shrink: 1;`
- `stretch` il pannello occuperà tutto lo schermo in altezza

>**TIPS:** tutte queste classi supportano sm, md, lg, xl usali per creare applicazioni responsive come si deve


### gap
Nel responsive NON si usano margini e padding, usa il gap, di seguito alcune classi di utilità già pronte
- `gap-0` imposta `gap: 0;`
- `gap-1` imposta `gap: 0.25rem;`
- `gap-2` imposta `gap: 0.5rem;`
- `gap-3` imposta `gap: 1rem;`
- `gap-4` imposta `gap: 1.5rem;`
- `gap-5` imposta `gap: 2rem;`
- `gap-6` imposta `gap: 3rem;`
- `gap-7` imposta `gap: 4rem;`
- `gap-8` imposta `gap: 5rem;`
- `row-gap-0` imposta `row-gap: 0;`
- `row-gap-1` imposta `row-gap: 0.25rem;`
- `row-gap-2` imposta `row-gap: 0.5rem;`
- `row-gap-3` imposta `row-gap: 1rem;`
- `row-gap-4` imposta `row-gap: 1.5rem;`
- `row-gap-5` imposta `row-gap: 2rem;`
- `row-gap-6` imposta `row-gap: 3rem;`
- `row-gap-7` imposta `row-gap: 4rem;`
- `row-gap-8` imposta `row-gap: 5rem;`
- `column-gap-0` imposta `column-gap: 0;`
- `column-gap-1` imposta `column-gap: 0.25rem;`
- `column-gap-2` imposta `column-gap: 0.5rem;`
- `column-gap-3` imposta `column-gap: 1rem;`
- `column-gap-4` imposta `column-gap: 1.5rem;`
- `column-gap-5` imposta `column-gap: 2rem;`
- `column-gap-6` imposta `column-gap: 3rem;`
- `column-gap-7` imposta `column-gap: 4rem;`
- `column-gap-8` imposta `column-gap: 5rem;`

### Prime flex
A questo link puoi trovare molte altre classi che ti possono essere utili [DOCS](https://www.primefaces.org/primeflex/flexdirection)

## Metodi

### getRecord
Ritona il valore del record di un form
```js
var record = context.panels.user_detail.getRecord()
```

### save
-- todo: wip
```js
context.panels.user_detail.save();
```

### load
```js
context.panels.panel_id.load(args);
```
Il metodo `load` carica il form partendo dallo store contenuto nel file `.js` presente nella sezione code sotto la voce `form store`.

Se ad esempio il nostro form ha come id `user_detail` allora dovremmo cercare il file situato in:

```
code
│   
└───form store
       └───user_detail.js

es: context.panels.user_detail.load({uid:"pippo"});
 
```

**N.B.** come si può intuire, se 2 pannelli hanno lo stesso `id` useranno lo stesso store. Questo può tornare molto utile quando si vogliono realizzare finestre diverse con pannelli diversi ma che condividono lo stesso store.

Di seguito un esempio di store:
```javascript
const uid = req.query.uid;
const tenant = req.headers.tenant;

...your logic

const ret = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    disabled:  user.user.disabled ,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
    userRoles: userRoles,
    rolesAvailable: rolesAvailable
};

return ret;
```


# Controlli di un Form

## Eventi 
Gli eventi sono delle funzioni che si possono definire all'interno dell'oggetto rappresentante il controllo del form.

```
 items: [{
            colNumber: "col-12 md:col-6",
            fieldMargin: "mt-4",
            type: "textInput",
            hasFloatingLabel: true,
            value: "",
            width: "w-full",
            id: "windowId",
            disabled: false,
            label: "Id finestra",
            onChange: function (event, context, value) {
                //enjoy!!
                console.log(context.panels.window_header.getRecord())
            }
         },
    ...
    ]
```



### onChange
```js
  onChange : function (event, context, value) ;
```


## Code Editor

### Prorietà
- `theme` light / vs-dark / hc-black
- `defaultValue`
- `value`
- `theme`
- `defaultLanguage`
- `language`
- `enable`
- `classNames`
- `labelClassName`
- `fieldClassName`

### Metodi

#### disable
```
disable(boolean enable)
```

## Autocomplete
### Prorietà
- `value`: array dei valori selezionati (in alternativa viene usato record[config.id] )
- `descriptionField`: attributo dei valori disponibili da usare per la descrizione
- `filterField`: campo dell'oggetto da usare per filtrare i suggerimenti
- `availableValues`: [in alternativa a availableValuesField] array valori dispnibili
- `availableValuesField`: [in alternativa a availableValues] attributo del record contente l'array dei valori disponibili
