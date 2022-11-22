const application = req.headers.application;
const destapplication = req.headers.destapplication;

console.info("destapplication:" + destapplication);

var ret = await scripts.list({ application: destapplication });
//console.info(ret);



function listToTree(_list) {

  if (!_list) {
    return undefined;
  }

  let treeList = _list.map(function (file) {
    if (!file) {
      return undefined;
    }

    const icon = file.isDir ? "pi pi-fw pi-folder" : "pi pi-fw pi-file";
    const label = file.file

    const scriptItem = {
      key: file.filePath,
      label: label,
      data: label, //"Documents Folder",
      icon: icon,
      children: file.isDir ? listToTree(file.list) : undefined,
      //parametri custom
      isDir: file.isDir,
      filePath: file.filePath
    }

    return scriptItem;
  });

  treeList = treeList.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });

  return treeList;
}

const treeData = listToTree(ret);
//return treeData;

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