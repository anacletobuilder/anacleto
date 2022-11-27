# Translation
Anacleto allows you to translate your application and will use the browser language to show the correct translation.

You have two levels of translation available:
- Application: translations applied to the entire application, regardless of the window
- Window: trabslatins applied to a specif window

## Application translations
You can define translations that will be available in all application windows, these translations are customizable by the functionality: `Anacleto Builder -> UI -> Transaltions`.

These translations are organized in a JSON with key-value format, where key is the translation key (case sensitive) and the value is the translation for the specif language.

### Devs
Translations are managed through files located in the root of the project:
- `i18n.json`: contains default translations
- `i18n.{LANGUAGE}.json`: where `{LANGUAGE}` is the ISO2 code of the translations, contains translations for the specified language


## Window translations
You can define translations that will be available for a specific window, these translations are customizable from the window builder, `Anacleto Builder -> UI -> Windows -> YOUR_WINDOW`

These translations are organized in a JSON with key - value format, where key is the `label` or `id` of the item you want to translate.

### Devs
Translations are managed through files located in the same folder of the window:
- `{WINDOW}.{LANGUAGE}.json`: where `{WINDOW}` is the window name and `{LANGUAGE}` is the ISO2 code of the translations, contains translations for the specified language

## Use translations in windows
Application and window translations can be combined as you wish.

> The window translations have priority over the application ones

> The item id translations have priority over the label ones

Let's see an example.

**my_window.json**
```json
{
  "id": "home",
  "windowName": "Home",
  "component": "GridContainer",
  "items": [
    {
      "id": "home_sample_form",
      "component": "Form",
      "isCard": true,
      "toggleable": false,
      "title": "Welcome form",
      "containerClassName": "col-12",
      "className": "mt-0",
      "items": [
        {
          "component": "Label",
          "className": "col-12",
          "id": "title",
          "label": "Welcome"
        },
        {
          "component": "Label",
          "className": "col-12",
          "id": "subtitle",
          "label": "My subtitle"
        },
        {
          "component": "Label",
          "className": "col-12",
          "id": "subtitle-2",
          "label": "My subtitle"
        }
      ]
    }
  ]
}
```

In this example the window has 3 components:
- `my_label_1` whit default label value `Welcome`
- `subtitle` whit default label value `My subtitle`
- `subtitle-2` whit default label value `My subtitle`

Now let's try to add the **application** translations for the `it` language

**i18n.it.json**
```json
{
    "Welcome": "Benvenuto"
}
```

In this way we have added an application translation for `Welcome` text, all the application labels equal to `welcome` will be translated into `Benvenuto`.

> This solution is useful when you want to massively translate a specific string for all application windows components

This is the result for `it` users:
- `my_label_1` label value is `Benvenuto`
- `subtitle` label value is `My subtitle`
- `subtitle-2` label value is `My subtitle`

Add now a translation specific for my_window.

**my_window.it.json**
```json
{
    "My subtitle": "Ciao amico"
}
```

In this way we have added a specif window translation for `My subtitle` text, all occurence of `My subtitle` are traslate with `Ciao Amico`.

> This solution is useful when you want to massively translate a specific string for all window components

This is the result for `it` users:
- `my_label_1` label value is `Benvenuto`
- `subtitle` label value is `Ciao amico`
- `subtitle-2` label value is `Ciao amico`

Add now a new translation for a specific `id.`

**my_window.it.json**
```json
{
    "My subtitle": "Ciao amico",
    "subtitle-2": "Grazie per aver scelto Anacleto"
}
```

This is the result for `it` users:
- `my_label_1` label value is `Benvenuto`
- `subtitle` label value is `Ciao amico`
- `subtitle-2` label value is `Grazie per aver scelto Anacleto`