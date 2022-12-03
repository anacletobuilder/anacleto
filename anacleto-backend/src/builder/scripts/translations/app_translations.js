const application = req.headers.application;
const destapplication = req.headers.destapplication;

console.info("destapplication:" + destapplication);

function listToTree(_list) {

  if (!_list) {
    return undefined;
  }

  let treeList = _list.map(function (language) {
    if (!language) {
      return undefined;
    }

    let languageDescription = 'App translations'
    if(language !== 'i18n.json'){
      languageDescription = language.replace('i18n.', '').replace('.json', '').toUpperCase()
    }

    const scriptItem = {
      key: language,
      label: languageDescription,
      data: language, 
      icon: "pi pi-fw pi-language",
    }

    return scriptItem;
  });

  treeList = treeList.sort((a, b) => {
    if (a.key === 'i18n.json' || a.label < b.label) {
      return -1;
    }
    if (b.key === 'i18n.json' || a.label > b.label) {
      return 1;
    }
    return 0;
  });

  return treeList;
}

const ret = translations.getAppLanguages({ application: destapplication });
const treeData = listToTree(ret);

//Aggiungo un nodo fittizio con il nome dell'app mi aiuta a capire in che app sono e posso mettere le feature del tasto destro
return [{
  key: `root`,
  label: destapplication,
  data: destapplication,
  icon: "pi pi-fw pi-window",
  children: treeData,
  isRoot:true
}];