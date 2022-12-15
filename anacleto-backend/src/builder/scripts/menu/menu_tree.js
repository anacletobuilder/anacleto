const application = req.headers.application;
const destapplication = req.headers.destapplication;


function listToTree(_list) {
    if (!_list) {
        return undefined;
    }

    return _list.map(function (leave) {
        if (!leave) {
            return undefined;
        }

        return {
            key: leave.key || utils.uuid(),
            label: leave.label,
            icon: leave.icon || (leave.items ? "pi pi-fw pi-sitemap" : "pi pi-fw pi-circle-fill"),
            children: listToTree(leave.items),
            //Perchè riportare l'oggetto in ingresso se creo quello nuovo? leave: leave, 
            command: leave.command
        }
    });

}



let treeData = [];
const appMetaString = metadata.get({ application: destapplication });
if (appMetaString) {
    try {
        const appMeta = JSON.parse(appMetaString);
        if (appMeta) {
            treeData = listToTree(appMeta.menu);
        } else {
            console.warn(`Invalid appMeta ${appMeta}`);
        }
    } catch (e) {
        console.warn(`Invalid appMeta ${appMetaString}`);
    }
}

//Aggiungo un nodo fittizio con il nome dell'app mi aiuta a capire in che app sono e posso mettere le feature del tasto destro
return [{
    key: `root`,
    label: destapplication,
    data: destapplication,
    icon: "pi pi-fw pi-window",
    children: treeData,
    //parametri custom
    isDir: false,
    isRoot: true
  }];
