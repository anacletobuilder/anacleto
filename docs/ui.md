# Ancleto UI
In Anacleto ogni finestra è rapresentata da un oggetto javascript. Questo oggetto contiene tutte le info necessarie per renderizzare l'intera finestra.

Di seguito un esempio:

```javascript
{
    "window": "windows_list",
    "layout": "grid",
    "classNames": "myClass1 myClass2"
    "items" : [
        {
            "id": "scripts",
            "type": "tree",
            "colNumber": "col-3",
            "title": "Scripts Tree",
            "classNames": "bg-primary-reverse",
            "style": {
                "gap": "1rem"
            },
            "isCard": false,
            "toggleable": false,
            "onSelect": function (event, context) {
                context.panels.script_editor.setShowToolbar(false);
                context.panels.script_editor.items.source.disabled = true;
                const record = {
                            source:"bla bla",
                            source: "alert('hello!')"
                        }
                context.panels.script_editor.setRecord(record);        
                context.panels.script_editor.setShowToolbar(true);
        },
        {
            "id": "script_editor",
            "type": "form",
            "colNumber": "col-9",
            "classNames": "bg-primary-reverse",
            "title": "",
            "isCard": true,
            "toggleable": false,
            "actions": [{
                "label": "Save",
                "icon": "pi pi-save",
                "onClick": function (event, context) {
                    context.panels.script_editor.setIsToolbarLoading(true);
                    utils.showToast({ severity: 'success', summary: 'Yeah!', life: 3000 });
                    context.panels.script_editor.setIsToolbarLoading(false);
                    });
                },
                "actions": [{
                    "label": 'Rename',
                    "icon": 'pi pi-pencil',
                    "onClick": (e) => {
                        //enjoy
                    }
                },
                {
                    "label": 'Delete',
                    "icon": 'pi pi-times',
                    "onClick": (e) => {
                        //enjoy
                    }
                },]
            }],
            "items": [{
                "colNumber": "col-12 md:col-6",
                "fieldMargin": "mt-4",
                "type": "textInput",
                "hasFloatingLabel": true,
                "value": "",
                "id": "my_field",
                "disabled": true,
                "label": "My field",
                "onChange": function (event, context, value) {
                    console.log(context.panels.script_editor.getRecord())
                }
            }]
        }
    ]
}

```

È fondamentale per ogni item specificare l'attributo `id`, questo ci permetterà di interagire con il controllo tramite Javascript.

Supponiamo ad esempio di voler cambiare la label del campo di input `my_field` presente all'interno del pannello `scripts_editor`, quello che ci basterà fare è:

```javascript
context.panels.scripts_editor.items.my_field.label = `My field Edit`;
```

**NB: l'id di un item NON è l'id del tag html.**

**NON USARE MAI FUNZIONI JS tipo: document.getElementById o document. querySelector  PER MODIFICARE UNA FINESTRA** :smiling_imp:  Ho sentito che è stato recentemente creato un apposito girone dell'inferno :smiling_imp:

Anacleto è stato sviluppato in React e per sfruttarne a pieno le potenzialità dobbiamo dimenticarci l'esistenza di questi metodi, in React ogni controllo grafico è legato a delle proprietà Javascript e per modificarlo bisogna agire su queste:smiling_face_with_three_hearts: 

## Layout
Quando crei una finestra puoi scegliere tra 2 tipi di layout, usando la proprietà `layout`
* grid
* flex

Se non viene specificata acluna proprietà verrà usato il valore di default `grid`

Oltre al layout puoi aggiungre alla finestra classi aggiuntive usando l'attributo `classNames`

## grid layout
```json
"layout" : "grid"
```
Quando utilizzi il layout grid Anacleto è completamente autonomo nel disporre i pannelli all'interno di una finestra, la sola cosa che devi fare è dare un peso **da 1 a 12** ai pannelli.
> Se un peso non viene specificato di default il valore è 12.

Il peso di un pannello va specificato tramite la proprietà `colNumber` utilizzando le classi apposite `col-1`,`col-2` ... `col-12`.

Se decidi di usare `col` senza specificare un peso, le colonne verranno equidistribuite.

Se vuoi dare ad una collonna una dimensione specifica usa `col-fixed` e specifica nello style la dimensione dediderata.

Se ne hai la necessuità puoi definire un peso diverso per schermi diversi, per farlo utilizza i prefissi:
- sm
- md
- lg
- xl

Immagina lo schermo diviso in 12 colonne, nell'esempio di seguito la larghezza del pannello sarà di default 12 (l'intera larghezza dello schermo).
Negli schermi di medie dimensioni il pannello occuperà 8 colonne (2/3 dello schermo), mentre degli schermi grandi (o molto grandi) grandi il pannello occuperà 6 colonne di 12 (ossia metà schermo).
```json
"colNumber" : "col-12 md:col-8 lg:col-6"
```

>**TIPS:**  Questa tecnica delle 12 colonne è largamente utilizzata da molti anni per creare applicazioni responsive. Se sei curioso indaga un po' nel web

In aggiunta alla proprietà `colNumber` puoi utilizzare `classNames` per aggiungere al tuo pannello le classi che più desideri separata da spazio.

le classi `col-offset-1`..`col-offset-12` ti permettono di definire il margine sinistro, utile se vuoi aggiungere spazi o centrare un pannello.

>**TIPS:** Puoi combinare più layout grid per creare layout più complessi, di seguito un esempio.

```json
{
    "window": "home",
    "layout":"grid",
    "items": [

        {
            "id": "panel_0",
            "type": "gridcontainer",
            "colNumber" : "col-8",
            "title": "Col 8",
            "classNames": "",
            "isCard": true,
            "items": [
                {
                    "id": "panel_1",
                    "type": "form",
                    "colNumber" : "col-6",
                    "title": "Col 6",
                    "classNames": "",
                    "isCard": true,
                    "items": [
                        {
                            "id": "button1",
                            "type": "button",
                            "colNumber" : "col-12",
                            "width": "w-full",
                            "label": "Button 1",
                        }
                    ]
                },
                {
                    "id": "panel_2",
                    "type": "form",
                    "colNumber" : "col-6",
                    "title": "Col 6",
                    "classNames": "",
                    "isCard": true,
                    "items": [
                        {
                            "id": "button1",
                            "type": "button",
                            "colNumber" : "col-12",
                            "width": "w-full",
                            "label": "Button 1",
                        }
                    ]
                },
                {
                    "id": "panel_3",
                    "type": "form",
                    "colNumber" : "col-12",
                    "title": "Col 12",
                    "classNames": "",
                    "isCard": true,
                    "items": [
                        {
                            "id": "button1",
                            "type": "button",
                            "colNumber" : "col-12",
                            "width": "w-full",
                            "label": "Button 1",
                        }
                    ]
                }
            ]
        },
        {
            "id": "panel-4",
            "type": "form",
            "title": "Col-4",
            "colNumber" : "col-4",
            "classNames": "",
            "isCard": true,
            "items": [
                {
                    "id": "button1",
                    "type": "button",
                    "colNumber" : "col-12",
                    "width": "w-full",
                    "label": "Button 1",
                }
            ]
        }
    ]
}
```

![neted grid](images/ui_nested_grid.png "Nested grid")


## flex system
```json
"layout" : "flex"
```
Flex, flex e ancora flex...se non sa di cosa stiamo parlando documentati qui:
- [Docs](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) 
- [Video](https://www.youtube.com/watch?v=IDDK6sX003Q)
- [Video esempio 2](https://www.youtube.com/watch?v=M1yD8GVpLnQ)

Se vuoi essere libero di disegnare una finestra a tuo piacimaneto imposta l'attributo della finestra `layout=flex`, da questo momento in poi sarai libero di posizionare i pannelli come desideri utilizzando la proprietà `classNames`

Quando utilizzi il layout `flex` Anacleto di mette a disposizione alcune classi che possono aiutarti nel posizionare un pannello

- `flex-row` imposta `flex-direction: row;`
- `flex-row-reverse` imposta `flex-direction: row-reverse;`
- `flex-column` imposta `flex-direction: column;`
- `flex-column-reverse`imposta `flex-direction: column-reverse;`

- `flex-wrap` imposta `flex-wrap: wrap;`
- `flex-wrap-reverse` imposta `flex-wrap: wrap-reverse;`
- `flex-nowrap` imposta `flex-wrap: nowrap;`

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

## style
Per ogni pannello (o controllo) puoi usare la proprietà `style` per definire degli style in-line. Usala con cautela, in generale è sempre meglio definire una classe!

Es:
```json
style: {
    gap: "1rem"
},
```

# Pannelli
In una finestra di Anacleto puoi inserire diversi tipi di pannello.

Ogni tipo di pannello estende il [Pannello](ui_panel.md) e ne eredita i metodi e le proprietà.

Di seguito i tipi di pannello disponibili:
- [Grid Container](ui_gridcontainer.md)
- [TabView](ui_tabview.md)
- [Form](ui_form.md)
- [Table](ui_table.md)
- [Tree](ui_tree.md)
