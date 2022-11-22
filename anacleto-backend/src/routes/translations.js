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
			if (window){
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


}