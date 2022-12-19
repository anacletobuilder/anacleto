const fs = require("fs");
const logger = require("../utils/logger");
const path = require("path");
const windowUtils = require("../utils/windowUtils");

module.exports = function (app) {
	app.get("/window", (req, res) => {
		try {
			const application = req.headers.application;
			const window = req.query.window;
			const requiredAppWindow = req.query.application || application;

			console.info(`Get window ${window} for application ${requiredAppWindow}`);

			let ret, windowRawData;
			if (requiredAppWindow == "BUILDER") {
				const windowPath = path.join(
					__dirname,
					"../builder",
					`windows`,
					`${window}.json`
				);
				if (fs.existsSync(windowPath)) {
					windowRawData = fs.readFileSync(windowPath, "utf8");
				}else{
					windowRawData = windowUtils.getWindowRawData(
						req.query.destapplication,
						window
					);
				}
			} else {
				windowRawData = windowUtils.getWindowRawData(
					requiredAppWindow,
					window
				);
			}

			if (!windowRawData) {
				windowRawData = {
					id: "404",
					component: "GridContainer",
					items:[
						{
							id: "home_panel",
							component: "Form",
							title: "404 - Window not found",
							className: "col-12 bg-primary-reverse",
							isCard: true
						}
					]
				};
			}

			return res.send(windowRawData);
		} catch (e) {
			console.error(e);
			res.sendStatus(500);
		}
	});

	app.post("/window", (req, res) => {
		try {
			const application = req.headers.application;
			const destapplication = req.query.application;
			const windowName = req.query.window;

			if (!destapplication || destapplication == "BUILDER") {
				console.error("invalid app: " + destapplication);
				throw new Error("invalid app");
			}

			windowUtils
				.createWindow(
					destapplication,
					req.user,
					windowName,
					req.body.data
				)
				.then((data) => {
					res.send({ success: true });
				})
				.catch((error) => {
					console.error(`Update window ${windowName} error`, error);
					res.send({ success: false, message: error.message });
				});
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.patch("/window", (req, res) => {
		try {
			const application = req.headers.application;
			const destapplication = req.query.application;
			const windowName = req.query.window;

			if (!destapplication || destapplication == "BUILDER") {
				console.error("invalid app: " + destapplication);
				throw new Error("invalid app");
			}

			windowUtils
				.updateWindow(
					destapplication,
					req.user,
					windowName,
					req.body.data
				)
				.then((data) => {
					res.send({ success: true });
				})
				.catch((error) => {
					console.error(`Create window ${windowName} error`, error);
					//res.send({ success: false, message: error.message });
					res.sendStatus(500);
				});
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.delete("/window", (req, res) => {
		try {
			const application = req.headers.application;
			const destapplication = req.query.application;
			const windowName = req.query.window;

			if (!destapplication || destapplication == "BUILDER") {
				console.error("invalid app: " + destapplication);
				throw new Error("invalid app");
			}

			windowUtils
				.deleteWindow(destapplication, req.user, windowName)
				.then((data) => {
					console.info("delete window: " + data);
					res.send({ success: true });
				})
				.catch((error) => {
					console.error(`Delete window ${scriptName} error`, error);
					//res.send({ success: false, message: error.message });
					res.sendStatus(500);
				});
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});
};
