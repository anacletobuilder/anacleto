const application = req.headers.application;
const destapplication = req.headers.destapplication;

var ret = await windows.list({application:destapplication});
console.info(ret);
ret = ret.filter(name => name.split(".").length == 2 && (name.toLowerCase().endsWith(".json") || name.toLowerCase().endsWith(".js")) )
ret = ret.map(function (fileName) { return { window: fileName.replace('.json', '') } } );
return ret;