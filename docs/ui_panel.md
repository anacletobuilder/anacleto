# Pannello
Una finestra è composta da uno o più pannelli.

Ogni pannello è caraterizzato da una proprità `id` univoco all'interno della finestra e da un `type` che indica il tipo di pannello.

## Proprietà
- `id` id del pannello
- `type` tipo del pannello
- `items` array di sottopannelli presenti nel pannello
- `classNames` classi da aggiugnere al pannello
- `style` oggetto con gli stile da mettere in linea


## Metodi JS


Per accedere ad un pannello da un evento `javascript` usare il context (disponibile in ogni evento), accedere alla proprietà pannels e quindi al pannello desiderato.

Es: 
```js
context.panels.user_detail
```

### setTitle
```
setTitle(string title)
```

### showToolbar
```
showToolbar(boolean show)
```

### showToolbarSpinner
```
setIsToolbarLoading(boolean show)
```

## Eventi
Gli eventi vanno definiti all'interno dell'oggetto pannello

### afterRender
```js
  afterRender: function(event, context);
```

## Toolbar
Se un pannello ha la proprietà `isCard = true` allora è possibile definire i pulsanti presenti nella toolbar, la toolbar è disponibile solo per i pannelli in modalità card.
Per farlo va specificato l'attributo `actions` con l'array dei bottoni presenti in toolbar.
Se si vuole mostrare per un bottone dei sottobottoni, specificarli nell'atributo `actions`.

```js
{
  actions: [
    {
      label: "Save",
      icon: "pi pi-save",
      onClick: function(event, context) {
        alert("Save")
      },
      actions: [
        {
          label: 'Rename',
          icon: 'pi pi-pencil',
          onClick: (event, context)=>{
            alert("TODO")
          }
        },
        {
          label: 'Delete',
          icon: 'pi pi-times',
          onClick: (event, context)=>{
            alert("TODO")
          }
        },
        
      ]
    }
  ]
}
```