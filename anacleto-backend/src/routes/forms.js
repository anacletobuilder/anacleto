const logger = require("../utils/logger");

module.exports = function (app) {
	app.post("/form", (req, res) => {
		try {
			var ret = {
				success: true,
			};

			const application = req.headers.application;
			const body = req.body;

			res.send(ret);
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.patch("/form", (req, res) => {
		try {
			var ret = {
				success: true,
			};
			res.send(ret);
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});
};
