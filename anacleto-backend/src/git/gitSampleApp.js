const METADATA = {
  "application": "ANACLETO_SAMPLE",
  "name": "ANACLETO_SAMPLE",
  "thema": "",
  "appLogo": "",
  "menu": [
    {
      "id": "HOME",
      "key": "HOME",
      "label": "Home",
      "icon": "pi pi-fw pi-home",
      "command": {
        "body": "utils.openWindow({\n\twindow : '/home',\n\tsearchParams : {}\n});"
      }
    }
  ]
}

const I18N = {
  "ANACLETO_SAMPLE": "Anacleto example"
}

const HOME = {
  "id": "home",
  "windowName": "Home",
  "component": "GridContainer",
  "components": [
    {
      "id": "home_sample_form",
      "component": "Form",
      "isCard": true,
      "toggleable": false,
      "title": "Welcome form",
      "containerClassName": "col-12 md:col-6",
      "className": "mt-0 md:mt-4",
      "components": [
        {
          "component": "Label",
          "className": "col-12 font-bold text-3xl",
          "id": "title",
          "label": "ANACLETO_SAMPLE"
        },
        {
          "component": "Label",
          "className": "col-12 mt-3",
          "id": "subtitle",
          "label": "Thank you for installing Anacleto Builder! 🦉"
        },
        {
          "component": "Label",
          "className": "col-12 mt-3",
          "id": "subtitle-2",
          "label": "This is an example window created using Anacleto, use the Builder to customize it and start building your application."
        },
        {
          "component": "Button",
          "containerClassName": "col-auto mt-5",
          "className": "col-12 md:col-6",
          "id": "btnBuilder",
          "label": "Go to Builder 👷‍♂️",
          "events": {
            "onClick": {
              "body": "window.open('/admin', '_blank').focus();"
            }
          }
        },
        {
          "component": "Label",
          "className": "col-12 mt-5",
          "id": "subtitle-3",
          "label": "If you have any questions check out the Docs or contact us on GitHub. 🧐"
        },
        {
          "component": "Button",
          "containerClassName": "col-12 md:col-6 mt-5",
          "className": "col-12",
          "id": "btnDocs",
          "label": "Docs 📖",
          "events": {
            "onClick": {
              "body": "window.open('https://github.com/anacletobuilder/anacleto.wiki.git', '_blank').focus();"
            }
          }
        },
        {
          "component": "Button",
          "containerClassName": "col-12 md:col-6 mt-5",
          "className": "col-12",
          "id": "btnGit",
          "label": "GitHub 🗂",
          "events": {
            "onClick": {
              "body": "window.open('https://github.com/anacletobuilder/anacleto', '_blank').focus();"
            }
          }
        }
      ]
    },
    {
      "id": "home_sample_grid",
      "component": "DataTable",
      "store": "sample_store",
      "emptyMessage": "No owls",
      "isCard": true,
      "toggleable": false,
      "title": "Owls",
      "containerClassName": "col-12 md:col-6",
      "className": "mt-0 md:mt-4",
      "sortable": true,
      "stripedRows": true,
      "skeletonRow": 5,
      "paginator": true,
      "paginationType": "client",
      "globalFilterMode": "client",
      "globalFilterFields": ["name", "scientificName", "type"],
      "columns": [
        {
          "field": "name",
          "header": "Name",
          "sortable": true
        },
        {
          "field": "scientificName",
          "header": "Scientific Name",
          "sortable": true
        },
        {
          "field": "type",
          "header": "Owl type",
          "sortable": true,
          "pugTemplate": "return `div.flex.flex-row\n\tspan.flex-shrink-0.p-tag.surface-300\n\t\tspan.text-600.flex-shrink-0 ${data['type']}`;"
        },
        {
          "field": "dangerOfExtinction",
          "header": "Danger of extinction",
          "sortable": true,
          "pugTemplate": "let emoj = '😊';\nif(data['dangerOfExtinction']===1){emoj='😨'}\nif(data['dangerOfExtinction']===2){emoj='😱'}\nreturn `span ${emoj}`"
        }
      ],
      "events": {
        "onSelectionChange": {
          "parameters": "event",
          "body": "if(event.value){ alert(`${event.value.name} is so cute!`) } ;"
        },
        "afterRender": {
          "body": "this.load();"
        }
      }
    }
  ]
}

const HOME_IT = {
  "subtitle": "Grazie per aver installato Anacleto Builder! 🦉",
  "subtitle-2": "Questo è un esempio di finestra creata usando Anacleto, usa il builder per personalizzarla e inizia a costruire la tua applicazione.",
  "subtitle-3": "Per qualsiasi dubbio controlla la documentazione o contattaci su GitHub 🧐",
  "btnBuilder": "Vai al Builder 👷‍♂️",
  "Docs 📖": "Documentazione 📖",
  "Name": "Nome",
  "type": "Tipo",
  "dangerOfExtinction": "Pericolo di estinzione"
}

const ROLE = {
  "ADMIN": {
    "description": "Admin role",
    "scripts": [
      "*"
    ],
    "windows": [
      {
        "*": {}
      }
    ]
  }
}

const SCRIPT_1 =
  `//Your first script!`;

const SCRIPT_2 =
  `/** 
 * Semple consts scripts
 */

const OWLS = [
  {
    "type": "Tytonidae",
    "name": "African Grass-Owl",
    "scientificName": "Tyto capensis"
  },
  {
    "type": "Tytonidae",
    "name": "Gufo asimmetrico",
    "scientificName": "Tyto glaucops"
  },
  {
    "type": "Tytonidae",
    "name": "Australian Masked-Owl",
    "scientificName": "Tyto novaehollandiae",
    "dangerOfExtinction": 2
  },
  {
    "type": "Tytonidae",
    "name": "Barn-Owl",
    "scientificName": "Tyto alba"
  },
  {
    "type": "Tytonidae",
    "name": "Gufo del Congo",
    "scientificName": "Phodilus prigoginei"
  },
  {
    "type": "Tytonidae",
    "name": "Eastern Grass-Owl",
    "scientificName": "Tyto longimembris",
    "dangerOfExtinction": 1
  },
  {
    "type": "Tytonidae",
    "name": "Gufo mascherato dorato",
    "scientificName": "Tyto aurantia"
  },
  {
    "type": "Tytonidae",
    "name": "Gufo fuligginoso",
    "scientificName": "Tyto tenebricosa"
  },
  {
    "type": "Tytonidae",
    "name": "Lesser Sooty-Owl",
    "scientificName": "Tyto multipunctata",
    "dangerOfExtinction": 1
  },
  {
    "type": "Tytonidae",
    "name": "Gufo rosso del Madagascar",
    "scientificName": "Tyto soumagnei"
  },
  {
    "type": "Tytonidae",
    "name": "Minahassa Masked-Owl",
    "scientificName": "Tyto inexspectata"
  },
  {
    "type": "Tytonidae",
    "name": "Oriental Bay-Owl",
    "scientificName": "Phodilus badius",
    "dangerOfExtinction": 2
  },
  {
    "type": "Tytonidae",
    "name": "Seram Masked-Owl",
    "scientificName": "Tyto almae"
  },
  {
    "type": "Tytonidae",
    "name": "Gufo della baia dello Sri Lanka",
    "scientificName": "Phodilus assimilis"
  },
  {
    "type": "Tytonidae",
    "name": "Sulawesi Masked-Owl",
    "scientificName": "Tyto rosenbergii",
    "dangerOfExtinction": 1
  },
  {
    "type": "Tytonidae",
    "name": "Taliabu Masked-Owl",
    "scientificName": "Tyto nigrobrunnea"
  },
  {
    "type": "Strigidi",
    "name": "Owlet barrato africano",
    "scientificName": "capens di Glaucidium"
  },
  {
    "type": "Strigidi",
    "name": "Gufo africano dalle lunghe orecchie",
    "scientificName": "Asio abyssinicus"
  },
  {
    "type": "Strigidi",
    "name": "Scops-Owl africano",
    "scientificName": "Otus senegalensis"
  },
  {
    "type": "Strigidi",
    "name": "African Wood-Owl",
    "scientificName": "Strix woodfordii"
  },
  {
    "type": "Strigidi",
    "name": "Akun Eagle-Owl",
    "scientificName": "Bubo leucostictus"
  },
  {
    "type": "Strigidi",
    "name": "Albertina Owlet",
    "scientificName": "Glaucidium albertinum",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo amazzonico",
    "scientificName": "Glaucidium hardyi"
  },
  {
    "type": "Strigidi",
    "name": "Boobook di Andaman",
    "scientificName": "affinis di Ninox",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Scimmia delle Andamane",
    "scientificName": "Otus balli",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo andino",
    "scientificName": "Glaucidium jardinii"
  },
  {
    "type": "Strigidi",
    "name": "Anjouan Scops-Owl",
    "scientificName": "Otus capnodes",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Annobon Scops-Owl",
    "scientificName": "Otus feae",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Scops-Owl arabo",
    "scientificName": "Otus pamelae"
  },
  {
    "type": "Strigidi",
    "name": "Asian Barred Owlet",
    "scientificName": "Glaucidium cuculoides"
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo australe",
    "scientificName": "Glaucidium nana"
  },
  {
    "type": "Strigidi",
    "name": "Baja Pygmy-Owl",
    "scientificName": "Glaucidium hoskinsii"
  },
  {
    "type": "Strigidi",
    "name": "Balsas Screech-Owl",
    "scientificName": "Megascops seductus"
  },
  {
    "type": "Strigidi",
    "name": "Gufo a fascia",
    "scientificName": "Pulsatrix melanota"
  },
  {
    "type": "Strigidi",
    "name": "Banggai Scops-Owl",
    "scientificName": "Otus mendeni",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Screech-Owl a gambe nude",
    "scientificName": "Margarobyas lawrencii"
  },
  {
    "type": "Strigidi",
    "name": "Screech-Owl Bare-Shanked",
    "scientificName": "Megascops clarkii"
  },
  {
    "type": "Strigidi",
    "name": "Barking Owl",
    "scientificName": "Ninox connivens"
  },
  {
    "type": "Strigidi",
    "name": "Barred Eagle-Owl",
    "scientificName": "Bubo sumatranus"
  },
  {
    "type": "Strigidi",
    "name": "Barred Owl",
    "scientificName": "Strix varia"
  },
  {
    "type": "Strigidi",
    "name": "Gufo stridulo barbuto",
    "scientificName": "Megascops barbarus",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Biak Scops-Owl",
    "scientificName": "Otus beccarii",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Bismarck Boobook",
    "scientificName": "Ninox variegata"
  },
  {
    "type": "Strigidi",
    "name": "Gufo bianco e nero",
    "scientificName": "Ciccaba nigrolineata"
  },
  {
    "type": "Strigidi",
    "name": "Gufo nero",
    "scientificName": "Ciccaba huhula"
  },
  {
    "type": "Strigidi",
    "name": "Screech-Owl con cappuccio nero",
    "scientificName": "Megascops atricapilla"
  },
  {
    "type": "Strigidi",
    "name": "Blakiston's Eagle-Owl",
    "scientificName": "Bubo blakistoni",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Boreal Owl",
    "scientificName": "Aegolius funereus"
  },
  {
    "type": "Strigidi",
    "name": "Brown Boobook",
    "scientificName": "Ninox scutulata"
  },
  {
    "type": "Strigidi",
    "name": "Gufo di pesce marrone",
    "scientificName": "Ketupa zeylonensis"
  },
  {
    "type": "Strigidi",
    "name": "Brown Wood-Owl",
    "scientificName": "Strix leptogrammica"
  },
  {
    "type": "Strigidi",
    "name": "Buff-Fronted Owl",
    "scientificName": "Aegolius harrisii"
  },
  {
    "type": "Strigidi",
    "name": "Buffy Fish-Owl",
    "scientificName": "Ketupa ketupu"
  },
  {
    "type": "Strigidi",
    "name": "Burrowing Owl",
    "scientificName": "Athene cunicularia"
  },
  {
    "type": "Strigidi",
    "name": "Buru Boobook",
    "scientificName": "Ninox hantu"
  },
  {
    "type": "Strigidi",
    "name": "Camiguin Boobook",
    "scientificName": "Ninox leventisi",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Cape Eagle-Owl",
    "scientificName": "Bubo capensis"
  },
  {
    "type": "Strigidi",
    "name": "Cebu Boobook",
    "scientificName": "Ninox rumseyi",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo dell'America centrale",
    "scientificName": "Glaucidium griseiceps"
  },
  {
    "type": "Strigidi",
    "name": "Chaco Owl",
    "scientificName": "Strix chacoensis"
  },
  {
    "type": "Strigidi",
    "name": "Owlet Castagna",
    "scientificName": "Glaucidium castaneum"
  },
  {
    "type": "Strigidi",
    "name": "Owlet Castagna",
    "scientificName": "Glaucidium castanotum",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Chocolate Boobook",
    "scientificName": "Ninox randi",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Christmas Boobook",
    "scientificName": "Ninox natalis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Cinnabar Boobook",
    "scientificName": "Ninox ios",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Cinnamon Screech-Owl",
    "scientificName": "Megascops petersoni"
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo Cloudforest",
    "scientificName": "Glaucidium nubicola",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Cloudforest Screech-Owl",
    "scientificName": "Megascops marshalli",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Colima Pigmeo-Gufo",
    "scientificName": "Glaucidium palmarum"
  },
  {
    "type": "Strigidi",
    "name": "Owlet collared",
    "scientificName": "Glaucidium brodiei"
  },
  {
    "type": "Strigidi",
    "name": "Scops-Owl colletto",
    "scientificName": "Otus lettia"
  },
  {
    "type": "Strigidi",
    "name": "Gufo screech colombiano",
    "scientificName": "Megascops colombianus",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo costaricano",
    "scientificName": "Glaucidium costaricanum"
  },
  {
    "type": "Strigidi",
    "name": "Crested Owl",
    "scientificName": "Lophostrix cristata"
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo cubano",
    "scientificName": "Glaucidium siju"
  },
  {
    "type": "Strigidi",
    "name": "Gufo reale oscuro",
    "scientificName": "Bubo coromandus"
  },
  {
    "type": "Strigidi",
    "name": "Screech-Owl orientale",
    "scientificName": "Megascops asio"
  },
  {
    "type": "Strigidi",
    "name": "Elfo Gufo",
    "scientificName": "micrneyene whitneyi"
  },
  {
    "type": "Strigidi",
    "name": "Enggano Scops-Owl",
    "scientificName": "Otus enganensis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Eurasian Eagle-Owl",
    "scientificName": "Bubo bubo"
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo eurasiatico",
    "scientificName": "Glaucidium passerinum"
  },
  {
    "type": "Strigidi",
    "name": "Europsian Scops-Owl",
    "scientificName": "Otus scops"
  },
  {
    "type": "Strigidi",
    "name": "Gufo spaventoso",
    "scientificName": "Nesasio solomonensis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo ferruginoso",
    "scientificName": "Glaucidium brasilianum"
  },
  {
    "type": "Strigidi",
    "name": "Gufo infuso",
    "scientificName": "Psiloscops flammeolus"
  },
  {
    "type": "Strigidi",
    "name": "Flores Scops-Owl",
    "scientificName": "Otus alfredi",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Forest Owlet",
    "scientificName": "Heteroglaux blewitti",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Fraser's Eagle-Owl",
    "scientificName": "Bubo poensis"
  },
  {
    "type": "Strigidi",
    "name": "Fulvous Owl",
    "scientificName": "Strix fulvescens"
  },
  {
    "type": "Strigidi",
    "name": "Giant Scops-Owl",
    "scientificName": "Otus gurneyi",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Gufo di Comoro Grande",
    "scientificName": "Otus pauliani",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Great Grey Owl",
    "scientificName": "Strix nebulosa"
  },
  {
    "type": "Strigidi",
    "name": "Grande gufo cornuto",
    "scientificName": "Bubo virginianus"
  },
  {
    "type": "Strigidi",
    "name": "Greyish Eagle-Owl",
    "scientificName": "Bubo cinerascens"
  },
  {
    "type": "Strigidi",
    "name": "Guadalcanal Boobook",
    "scientificName": "Ninox granti",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo guatemalteco",
    "scientificName": "Glaucidium cobanense"
  },
  {
    "type": "Strigidi",
    "name": "Gufo selvatico guatemalteco",
    "scientificName": "Megascops guatemalae"
  },
  {
    "type": "Strigidi",
    "name": "Halmahera Boobook",
    "scientificName": "Ninox hypogramma"
  },
  {
    "type": "Strigidi",
    "name": "Himalayan Owl",
    "scientificName": "Strix nivicolum"
  },
  {
    "type": "Strigidi",
    "name": "Hume's Boobook",
    "scientificName": "Ninox obscura"
  },
  {
    "type": "Strigidi",
    "name": "Gufo di Hume",
    "scientificName": "Strix butleri"
  },
  {
    "type": "Strigidi",
    "name": "Scops-Owl indiano",
    "scientificName": "Otus bakkamoena"
  },
  {
    "type": "Strigidi",
    "name": "Gufo giamaicano",
    "scientificName": "Pseudoscops grammicus"
  },
  {
    "type": "Strigidi",
    "name": "Scops-Owl giapponese",
    "scientificName": "Otus semitorques"
  },
  {
    "type": "Strigidi",
    "name": "Javan Owlet",
    "scientificName": "Glaucidium castanopterum"
  },
  {
    "type": "Strigidi",
    "name": "Javan Scops-Owl",
    "scientificName": "Otus angelinae",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Jungle Boobook",
    "scientificName": "Ninox theomacha"
  },
  {
    "type": "Strigidi",
    "name": "Jungle Owlet",
    "scientificName": "Glaucidium radiatum"
  },
  {
    "type": "Strigidi",
    "name": "Koepcke's Screech-Owl",
    "scientificName": "Megascops koepckeae"
  },
  {
    "type": "Strigidi",
    "name": "Least Boobook",
    "scientificName": "Ninox sumbaensis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Leag pigmeo",
    "scientificName": "Glaucidium minutissimum"
  },
  {
    "type": "Strigidi",
    "name": "Civetta",
    "scientificName": "Athene noctua"
  },
  {
    "type": "Strigidi",
    "name": "Screech-Owl a ciuffi lunghi",
    "scientificName": "Megascops sanctaecatarinae"
  },
  {
    "type": "Strigidi",
    "name": "Owlet Long-Whiskered",
    "scientificName": "Xenoglaux loweryi",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Luzon Boobook",
    "scientificName": "Ninox philippensis"
  },
  {
    "type": "Strigidi",
    "name": "Luzon Highland Scops-Owl",
    "scientificName": "Otus longicornis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Luzon Lowland Scops-Owl",
    "scientificName": "Otus megalotis"
  },
  {
    "type": "Strigidi",
    "name": "Gufo comune del Madagascar",
    "scientificName": "Asio madagascariensis"
  },
  {
    "type": "Strigidi",
    "name": "Gufo di Madagascar",
    "scientificName": "Otus rutilus"
  },
  {
    "type": "Strigidi",
    "name": "Gufo cornuto di Magellano",
    "scientificName": "Bubo magellanicus"
  },
  {
    "type": "Strigidi",
    "name": "Makira Boobook",
    "scientificName": "Ninox roseoaxillaris",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Malaita Boobook",
    "scientificName": "Ninox malaitae",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Maned Owl",
    "scientificName": "Jubula lettii"
  },
  {
    "type": "Strigidi",
    "name": "Mantanani Scops-Owl",
    "scientificName": "Otus mantananensis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Manus Boobook",
    "scientificName": "Ninox meeki"
  },
  {
    "type": "Strigidi",
    "name": "Marsh Owl",
    "scientificName": "Asio capensis"
  },
  {
    "type": "Strigidi",
    "name": "Mayotte Scops-Owl",
    "scientificName": "Otus mayottensis"
  },
  {
    "type": "Strigidi",
    "name": "Mentawai Scops-Owl",
    "scientificName": "Otus mentawi",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Mindanao Boobook",
    "scientificName": "Ninox spilocephala",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Mindanao Highland Scops-Owl",
    "scientificName": "Otus mirus",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Mindanao Lowland Scops-Owl",
    "scientificName": "Otus everetti"
  },
  {
    "type": "Strigidi",
    "name": "Mindoro Boobook",
    "scientificName": "Ninox mindorensis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Mindoro Scops-Owl",
    "scientificName": "Otus mindorensis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Moheli Scops-Owl",
    "scientificName": "Otus moheliensis",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Scops-gufo delle Molucche",
    "scientificName": "Otus magicus"
  },
  {
    "type": "Strigidi",
    "name": "Morepork",
    "scientificName": "Ninox novaeseelandiae"
  },
  {
    "type": "Strigidi",
    "name": "Gufo chiazzato",
    "scientificName": "Ciccaba virgata"
  },
  {
    "type": "Strigidi",
    "name": "Gufo di legno screziato",
    "scientificName": "Strix ocellata"
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo della montagna",
    "scientificName": "gnomo glaucidium"
  },
  {
    "type": "Strigidi",
    "name": "Scops-Owl",
    "scientificName": "Otus spilocephalus"
  },
  {
    "type": "Strigidi",
    "name": "New Britain Boobook",
    "scientificName": "Ninox odiosa",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Nicobar Scops-Owl",
    "scientificName": "Otus alius"
  },
  {
    "type": "Strigidi",
    "name": "Northern Boobook",
    "scientificName": "Ninox japonica"
  },
  {
    "type": "Strigidi",
    "name": "Falco del Nord",
    "scientificName": "Surnia ulula"
  },
  {
    "type": "Strigidi",
    "name": "Gufo comune nordico",
    "scientificName": "Asio otus"
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo del nord",
    "scientificName": "Glaucidium californicum"
  },
  {
    "type": "Strigidi",
    "name": "Gufo nordico- stuzzichino",
    "scientificName": "Aegolius acadicus"
  },
  {
    "type": "Strigidi",
    "name": "Gufo nordico dalla faccia bianca",
    "scientificName": "Ptilopsis leucotis"
  },
  {
    "type": "Strigidi",
    "name": "Boobook ocra-gonfiato",
    "scientificName": "Ninox ochracea",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Gufo dell'Oman",
    "scientificName": "Strix omanensis"
  },
  {
    "type": "Strigidi",
    "name": "Scops-Owl orientale",
    "scientificName": "Otus sunia"
  },
  {
    "type": "Strigidi",
    "name": "Pacific Screech-Owl",
    "scientificName": "Megascops cooperi"
  },
  {
    "type": "Strigidi",
    "name": "Palau Owl",
    "scientificName": "Pyrroglaux podargina"
  },
  {
    "type": "Strigidi",
    "name": "Palawan Scops-Owl",
    "scientificName": "Otus fuliginosus",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Pallid Scops-Owl",
    "scientificName": "Otus brucei"
  },
  {
    "type": "Strigidi",
    "name": "Papuan Boobook",
    "scientificName": "Uroglaux dimorpha"
  },
  {
    "type": "Strigidi",
    "name": "Owlet Perla-Spotted",
    "scientificName": "Glaucidium perlatum"
  },
  {
    "type": "Strigidi",
    "name": "Pel's Fishing-Owl",
    "scientificName": "Scotopelia peli"
  },
  {
    "type": "Strigidi",
    "name": "Pemba Scops-Owl",
    "scientificName": "Otus pembaensis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Pernambuco pigmeo-gufo",
    "scientificName": "Glaucidium mooreorum",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo peruviano",
    "scientificName": "Glaucidium peruanum"
  },
  {
    "type": "Strigidi",
    "name": "Screech-Owl peruviano",
    "scientificName": "Megascops roboratus"
  },
  {
    "type": "Strigidi",
    "name": "Pharaoh Eagle-Owl",
    "scientificName": "Bubo ascalaphus"
  },
  {
    "type": "Strigidi",
    "name": "Gufo reale delle Filippine",
    "scientificName": "Bubo philippensis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Potente gufo",
    "scientificName": "strenua Ninox"
  },
  {
    "type": "Strigidi",
    "name": "Screech-gufo portoricano",
    "scientificName": "Nibipes megascop"
  },
  {
    "type": "Strigidi",
    "name": "Rupi-Gufo",
    "scientificName": "Otus brookii"
  },
  {
    "type": "Strigidi",
    "name": "Owlet Red-Chested",
    "scientificName": "Glaucidium tephronotum"
  },
  {
    "type": "Strigidi",
    "name": "Red-Scops-Owl",
    "scientificName": "Otus rufescens",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Rinjani Scops-Owl",
    "scientificName": "Otus jolandae",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Rock Eagle-Owl",
    "scientificName": "Bubo bengalensis"
  },
  {
    "type": "Strigidi",
    "name": "Romblon Boobook",
    "scientificName": "Ninox spilonotus",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Rufescent Screech-Owl",
    "scientificName": "Megascops ingens"
  },
  {
    "type": "Strigidi",
    "name": "Rufous Fishing-Owl",
    "scientificName": "Scotopelia ussheri",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Rufous Owl",
    "scientificName": "Ninox rufa"
  },
  {
    "type": "Strigidi",
    "name": "Gufo a Fascia Rufous",
    "scientificName": "Ciccaba albitarsis"
  },
  {
    "type": "Strigidi",
    "name": "Gufo dalle gambe sporgenti",
    "scientificName": "Strix rufipes"
  },
  {
    "type": "Strigidi",
    "name": "Rusty-Barred Owl",
    "scientificName": "Strix hylophila",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Ryukyu Scops-Owl",
    "scientificName": "Otus elegans",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Sandy Scops-Owl",
    "scientificName": "Otus icterorhynchus"
  },
  {
    "type": "Strigidi",
    "name": "Sangihe Scops-Owl",
    "scientificName": "Otus collari"
  },
  {
    "type": "Strigidi",
    "name": "Sao Tome Scops-Owl",
    "scientificName": "Otus hartlaubi",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Seram Boobook",
    "scientificName": "Ninox squamipila"
  },
  {
    "type": "Strigidi",
    "name": "Serendib Scops-Owl",
    "scientificName": "Otus thilohoffmanni",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Seychelles Scops-Owl",
    "scientificName": "Otus insularis",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Shelley's Eagle-Owl",
    "scientificName": "Bubo shelleyi",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Gufo di palude",
    "scientificName": "Asio flammeus"
  },
  {
    "type": "Strigidi",
    "name": "Siau Scops-Owl",
    "scientificName": "Otus siaoensis",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Simeulue Scops-Owl",
    "scientificName": "Otus umbra",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Sjostedt's Owlet",
    "scientificName": "Glaucidium sjostedti"
  },
  {
    "type": "Strigidi",
    "name": "Snowy Owl",
    "scientificName": "Bubo scandiacus"
  },
  {
    "type": "Strigidi",
    "name": "Socotra Scops-Owl",
    "scientificName": "Otus socotranus"
  },
  {
    "type": "Strigidi",
    "name": "Sokoke Scops-Owl",
    "scientificName": "Otus ireneae",
    "dangerOfExtinction": 2
  },
  {
    "type": "Strigidi",
    "name": "Southern Boobook",
    "scientificName": "Boobook di Ninox"
  },
  {
    "type": "Strigidi",
    "name": "Gufo bianco dalla faccia bianca",
    "scientificName": "Ptilopsis granti"
  },
  {
    "type": "Strigidi",
    "name": "Speckled Boobook",
    "scientificName": "Ninox punctulata"
  },
  {
    "type": "Strigidi",
    "name": "Gufo dagli occhiali",
    "scientificName": "Pulsatrix perspicillata"
  },
  {
    "type": "Strigidi",
    "name": "Gufo reale dal ventre",
    "scientificName": "Bubo nipalensis"
  },
  {
    "type": "Strigidi",
    "name": "Gufo reale maculato",
    "scientificName": "Bubo africanus"
  },
  {
    "type": "Strigidi",
    "name": "Gufo maculato",
    "scientificName": "Strix occidentalis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Spotted Owlet",
    "scientificName": "Athene brama"
  },
  {
    "type": "Strigidi",
    "name": "Gufo di legno macchiato",
    "scientificName": "Strix seloputo"
  },
  {
    "type": "Strigidi",
    "name": "Gufo a strisce",
    "scientificName": "clamatore di Asio"
  },
  {
    "type": "Strigidi",
    "name": "Stygian Owl",
    "scientificName": "Asio stygius"
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo subtropicale",
    "scientificName": "Glaucidium parkeri"
  },
  {
    "type": "Strigidi",
    "name": "Sula Scops-Owl",
    "scientificName": "Otus sulaensis",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Sulawesi Scops-Owl",
    "scientificName": "Otus manadensis"
  },
  {
    "type": "Strigidi",
    "name": "Sulu Boobook",
    "scientificName": "Ninox reyi",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Sumba Boobook",
    "scientificName": "Ninox rudolfi",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Scopa-gufo Sunda",
    "scientificName": "Otus lempiji"
  },
  {
    "type": "Strigidi",
    "name": "Tamaulipas Pygmy-Owl",
    "scientificName": "Glaucidium sanchezi"
  },
  {
    "type": "Strigidi",
    "name": "Tanimbar Boobook",
    "scientificName": "Ninox forbesi"
  },
  {
    "type": "Strigidi",
    "name": "Tasmanian Boobook",
    "scientificName": "Ninox leucopsis"
  },
  {
    "type": "Strigidi",
    "name": "Tawny Fish-Owl",
    "scientificName": "Ketupa flavipes"
  },
  {
    "type": "Strigidi",
    "name": "Allocco",
    "scientificName": "Strix aluco"
  },
  {
    "type": "Strigidi",
    "name": "Screech-Owl Tawny-Bellied",
    "scientificName": "Megascops watsonii"
  },
  {
    "type": "Strigidi",
    "name": "Tawny-Browed Owl",
    "scientificName": "Pulsatrix koeniswaldiana"
  },
  {
    "type": "Strigidi",
    "name": "Togian Boobook",
    "scientificName": "Ninox burhani",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Screech-Owl tropicale",
    "scientificName": "Megascops choliba"
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo del Tucuman",
    "scientificName": "Glaucidium tucumanum"
  },
  {
    "type": "Strigidi",
    "name": "Gufo da capra non macchiato",
    "scientificName": "Aegolius ridgwayi"
  },
  {
    "type": "Strigidi",
    "name": "Ural Owl",
    "scientificName": "Strix uralensis"
  },
  {
    "type": "Strigidi",
    "name": "Gufo pescato vermiculato",
    "scientificName": "Scotopelia bouvieri"
  },
  {
    "type": "Strigidi",
    "name": "Screech-Gufo Vermiculated",
    "scientificName": "Megascops vermiculatus"
  },
  {
    "type": "Strigidi",
    "name": "Gufo reale di Verreaux",
    "scientificName": "Bubo lacteus"
  },
  {
    "type": "Strigidi",
    "name": "Visayan Scops-Owl",
    "scientificName": "Otus nigrorum",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Wallace's Scops-Owl",
    "scientificName": "Otus silvicola"
  },
  {
    "type": "Strigidi",
    "name": "West Solomons Boobook",
    "scientificName": "Ninox jacquinoti"
  },
  {
    "type": "Strigidi",
    "name": "Screech-Owl occidentale",
    "scientificName": "Megascops kennicottii"
  },
  {
    "type": "Strigidi",
    "name": "Wetar Scops-Owl",
    "scientificName": "Otus tempestatis"
  },
  {
    "type": "Strigidi",
    "name": "Screech-Owl",
    "scientificName": "Trichopsis Megascops"
  },
  {
    "type": "Strigidi",
    "name": "Gufo dai sopraccigli",
    "scientificName": "Athene superciliaris"
  },
  {
    "type": "Strigidi",
    "name": "Scops-Owl",
    "scientificName": "Otus sagittatus",
    "dalla": "fronte bianca ",
    "dangerOfExtinction": 1
  },
  {
    "type": "Strigidi",
    "name": "Screech-Owl dalla gola bianca",
    "scientificName": "Megascops albogularis"
  },
  {
    "type": "Strigidi",
    "name": "Gufo pigmeo di Yungas",
    "scientificName": "Glaucidium bolivianum"
  },
  {
    "type": "Strigidi",
    "name": "Yungas Screech-Owl",
    "scientificName": "Megascops hoyi"
  }
]`

const SCRIPT_3 =
  `
import "owls_list"

//do stuf

return OWLS;`

module.exports = {
  METADATA: METADATA,
  I18N: I18N,
  HOME: HOME,
  ROLE: ROLE,
  SCRIPT_1: SCRIPT_1,
  SCRIPT_2: SCRIPT_2,
  SCRIPT_3: SCRIPT_3,
  HOME_IT: HOME_IT
}