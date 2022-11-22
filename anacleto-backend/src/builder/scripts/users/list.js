var nextToken = req.token
var ret = await users.list(nextToken);
console.info(ret);
return ret.users;