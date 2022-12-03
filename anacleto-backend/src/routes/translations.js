const logger = require("../utils/logger");
const metadataUtils = require('../utils/metadataUtils');
const scriptutils = require("../utils/scriptutils");
const windowUtils = require('../utils/windowUtils');

module.exports = function (app) {
	app.get("/locales/:lng/:win?", (req, res) => {
		try {
			let ret = {}

			const application = req.headers.application;
			const language = req.params.lng
			const window = req.params.win
			if (window) {
				//load window translation
				ret = windowUtils.getWindowTranslations(application, window, language)
			} else {
				//load app translation
				ret = metadataUtils.getAppTranslations(application, language)
			}

			res.send(ret);
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.post("/translations/:lng/:win?", (req, res) => {
		try {
			const application = req.headers.application;
			const destapplication = req.query.application;
			const language = req.params.lng
			const window = req.params.win

			if (!destapplication || destapplication == "BUILDER") {
				console.error(`invalid app: ${destapplication}`);
				throw new Error("invalid app");
			}

			if (!language) {
				console.error(`invalid translation language: ${language}`);
				throw new Error("invalid translation language");
			}

			if (window) {
				//load window translation
				//TODO windowUtils.
			} else {
				//load app translation
				metadataUtils.addAppLanguage({ language, application: destapplication, user: req.user, })
					.then((data) => {
						res.send({ success: true, sha: scriptutils.getScriptSha(req.body.data) });
					})
					.catch((error) => {
						console.error(`Create script ${scriptName} error`, error);
						//res.send({ success: false, message: error.message });
						res.sendStatus(500);
					});
			}

		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.delete("/translations/:lng/:win?", (req, res) => {
		console.error(`Translation delete not implemented`);
		res.sendStatus(500);
	});

}