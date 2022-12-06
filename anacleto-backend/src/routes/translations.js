const fileUtils = require("../utils/fileUtils");
const { getFileSha: getFileSha } = require("../utils/fileUtils");
const logger = require("../utils/logger");
const metadataUtils = require('../utils/metadataUtils');
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
				ret = metadataUtils.getAppTranslations({application, language})
			}

			res.send(ret);
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.get("/translations/:lng?/:win?", (req, res) => {
		try {
			let source = {}

			const application = req.headers.application;
			const language = req.params.lng
			const window = req.params.win
			if (window) {
				//load window translation
				source = windowUtils.getWindowTranslations(application, window, language)
			} else {
				//load app translation
				source = metadataUtils.getAppTranslationsRawData({application, language})
			}
			source = source, null, 4

			res.send({ success: true, data: source, sha: getFileSha(source) });
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

			if (!language || language.length !== 2) {
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
						res.send({ success: true, sha: scriptutils.getFileSha(req.body.data) });
					})
					.catch((error) => {
						console.error(`Add app language ${scriptName} error`, error);
						//res.send({ success: false, message: error.message });
						res.sendStatus(500);
					});
			}

		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.patch("/translations/:lng?/:win?", (req, res) => {
		try {
			const application = req.headers.application;
			const destapplication = req.query.application;
			const scriptName = req.query.script;
			const language = req.params.lng
			const window = req.params.win


			if (!destapplication || destapplication == "BUILDER") {
				console.error("invalid app: " + destapplication);
				throw new Error("invalid app");
			}

			if (window) {
				//load window translation
				//TODO windowUtils.
			} else {
				//load app translation
				metadataUtils.updateAppLanguage({ language, application: destapplication, user: req.user, source : req.body.data, clientSha: req.body.sha})
					.then((data) => {
						res.send({ success: true, sha: fileUtils.getFileSha(req.body.data) });
					})
					.catch((error) => {
						console.error(`Update app language ${scriptName} error`, error);
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
		try {
			const application = req.headers.application;
			const destapplication = req.query.application;
			const scriptName = req.query.script;
			const language = req.params.lng
			const window = req.params.win


			if (!destapplication || destapplication == "BUILDER") {
				console.error("invalid app: " + destapplication);
				throw new Error("invalid app");
			}

			if (!language || language.length !== 2) {
				console.error(`invalid translation language: ${language}`);
				throw new Error("invalid translation language");
			}

			if (window) {
				//load window translation
				//TODO windowUtils.
			} else {
				//load app translation
				metadataUtils.deleteAppLanguage({ language, application: destapplication, user: req.user})
					.then((data) => {
						res.send({ success: true, sha: fileUtils.getFileSha(req.body.data) });
					})
					.catch((error) => {
						console.error(`Delete app language ${scriptName} error`, error);
						//res.send({ success: false, message: error.message });
						res.sendStatus(500);
					});
			}

		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

}