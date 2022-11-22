return mysql.query(req.body.queryArgs)
.then(res => {
	return Promise.resolve(res.rows);
})
.catch((e) => {
	return Promise.reject(e);
})