const fs = require("fs");
const logger = require("../utils/logger");
const path = require("path");
const scriptEvaluator = require("../businesslogic/scriptEvaluator");
const scriptUtils = require("../utils/scriptutils");

module.exports = function (app, {mySqlConnector, datastoreConnector}) {

	app.get("/script", (req, res) => {
		try {
			const application = req.headers.application;
			const destapplication = req.query.application;
			const script = req.query.script;

			if (!destapplication || destapplication == "BUILDER") {
				console.error("invalid app: " + destapplication);
				throw new Error("invalid app");
			}

			try {
				const scriptData = scriptUtils.getScriptFile(
					destapplication,
					script
				);
				res.send({ success: true, data: scriptData.source, sha: scriptData.sha });

			} catch (e) {
				console.error(`Error`, e);
				res.sendStatus(500);
			}
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.post("/script", (req, res) => {
		try {
			const application = req.headers.application;
			const destapplication = req.query.application;
			const scriptName = req.query.script;

			if (!destapplication || destapplication == "BUILDER") {
				console.error("invalid app: " + destapplication);
				throw new Error("invalid app");
			}

			scriptUtils
				.createScript(
					destapplication,
					req.user,
					scriptName,
					req.body.data
				)
				.then((data) => {
					res.send({ success: true, sha: scriptUtils.getFileSha(req.body.data) });
				})
				.catch((error) => {
					console.error(`Create script ${scriptName} error`, error);
					//res.send({ success: false, message: error.message });
					res.sendStatus(500);
				});
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.patch("/script", (req, res) => {
		try {
			const application = req.headers.application;
			const destapplication = req.query.application;
			const scriptName = req.query.script;

			if (!destapplication || destapplication == "BUILDER") {
				console.error("invalid app: " + destapplication);
				throw new Error("invalid app");
			}

			scriptUtils
				.updateScript(
					destapplication,
					req.user,
					scriptName,
					req.body.data,
					req.body.sha
				)
				.then((data) => {
					res.send({ success: true, sha: scriptUtils.getFileSha(req.body.data) });
				})
				.catch((error) => {
					console.error(`Update script ${scriptName} error`, error);
					if (error?.message === 'fail_sha') {
						res.send({ success: false, message: "Concurrent modification detected, please reload the script" });
					} else {
						res.sendStatus(500);
					}
				});
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.delete("/script", (req, res) => {
		try {
			const application = req.headers.application;
			const destapplication = req.query.application;
			const scriptName = req.query.script;

			if (!destapplication || destapplication == "BUILDER") {
				console.error("invalid app: " + destapplication);
				throw new Error("invalid app");
			}

			scriptUtils
				.deleteScript(
					destapplication,
					req.user,
					scriptName,
					req.query.isDir === "true"
				)
				.then((data) => {
					res.send({ success: true });
				})
				.catch((error) => {
					console.error(`Delete script ${scriptName} error`, error);
					//res.send({ success: false, message: error.message });
					res.sendStatus(500);
				});
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.all("/processScript", (req, res) => {
		try {
			//.all gestisce tutti i metodi POST/GET/PUT
			const application = req.headers.application;
			const destapplication = req.headers.destapplication;
			let ret;
			const id = req.query.script;

			if (!id) {
				console.error("invalid id: " + destapplication);
				throw new Error("Missing id");
			}

			if (application == "BUILDER") {
				const actionPath = path.join(
					__dirname,
					"../builder",
					`scripts`,
					`${id}.js`
				);
				try {
					let scriptSource;
					if (fs.existsSync(actionPath)) {
						scriptSource = fs.readFileSync(actionPath, "utf8");
					} else {
						//If the file doesn't exist in the builder path, try with the app path (e.g. preview panel)
						scriptSource = scriptUtils.getScriptRawData(
							destapplication,
							id,
							true
						);
					}
					ret = scriptEvaluator.processJS({ mySqlConnector, datastoreConnector }, req, scriptSource);
				} catch (e) { }
			} else {
				const scriptSource = scriptUtils.getScriptRawData(
					application,
					id,
					true
				);
				ret = scriptEvaluator.processJS({ mySqlConnector, datastoreConnector }, req, scriptSource);
			}

			ret.then((result) => {
				// do some processing of result into finalData
				res.send(result);
			}).catch((err) => {
				console.error(`Error`, err);
				res.sendStatus(500);
			});
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});
};
