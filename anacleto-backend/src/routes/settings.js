const logger = require("../utils/logger");
const appUtils = require("../utils/appUtils");
const appsConfiguration = appUtils.getAppsConfigurations();

module.exports = function (app) {
	app.get("/settings", (req, res) => {
		try {
			//TODO controllare i ruoli, solo admin può farlo
			let ret;
			const id = req.query.id;
			const application = req.headers.application;

			res.send({ success: true, data: appsConfiguration });
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});
};
