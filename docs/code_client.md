# Client

Tutti gli eventi (es onClick, afterRender..) hanno sempre almeno 2 parametri `event` e `context`:

```
/**
 * {object} event
 * {object} context, contesto applicativo
 */
var evento = function(event, context, [optional]);
```

In ogni evento client hai a disposizione la proprietà `context` a partire da questa puoi accedere a tutte le funzionalità di Anacleto.
- `context.panels` contiene una mappa di tutti i pannelli presenti nella finestra
- `context.panels.panel_id` ottieni le proprietà e i metodi disponibili per il panello con id `panel_id`
- `context.panels.panel_id.items` contiene tutti i controlli (o sottoppannelli) prensenti nel pannello con id `panel_id`

Anacleto mette a tua disposizione la classe `utils` che contiene tutte le funzioni di utilità.

# Dialog function

## utils.confirmDialog

```js
utils.showConfirmDialog({
    message: 'Do you want to delete this record?',
    header: 'Delete Confirmation',s
    icon: 'pi pi-info-circle',
    acceptClassName: 'p-button-danger',
    accept: function(){},
    reject: function(){},
});
```

## utils.showToast

```js
utils.showToast({severity:'warning', summary: 'TODO', detail:'Non implementato', life: 3000});
```

```js
utils.toast.show({severity:'warning', summary: 'TODO', detail:'Non implementato', life: 3000});
```

# Window function

## utils.openWindow
Questa funzione apre una finestra
```js
utils.openWindow({window:"path/to/window",searchParams:{},type: "window"})
```
Questa funzione apre una finestra modale
```js
utils.openWindow({window:"path/to/window",searchParams:{},type: "modal",settings:{}})
```
Questa funzione apre una sidebar
```js
utils.openWindow({window:"path/to/window",searchParams:{},type: "sidebar",settings:{}})
```