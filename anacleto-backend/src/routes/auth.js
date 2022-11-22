const logger = require("../utils/logger");
const userUtils = require("../utils/userUtils");
const roleUtils = require("../utils/roleUtils");

module.exports = function (app) {
	app.patch("/userRoles", (req, res) => {
		try {
			const application = req.headers.application;
			const destApplication = req.headers.destapplication;
			const tenant = req.headers.tenant;
			const userUid = req.query.userUid;
			const roles = req.body.data;

			userUtils
				.setUserRoles(userUid, destApplication, tenant, roles)
				.then(() => {
					res.send({ success: true });
				})
				.catch((error) => {
					console.error(`Update users error`, error);
					//res.send({ success: false, message: error.message });
					res.sendStatus(500);
				});
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});
	app.get("/roles", (req, res) => {
		//TODO controllare i ruoli, solo admin può farlo

		try {
			let ret;
			const id = req.query.id;
			const application = req.headers.application;

			if (!application || application == "BUILDER") {
				console.error("invalid app: " + application);
				throw new Error("invalid app");
			}

			const source = roleUtils.getRoleRawData(application);
			if (source) {
				res.send({ success: true, data: JSON.parse(source) });
			} else {
				console.error(`File not roles found..`);
				res.sendStatus(500);
			}
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});

	app.patch("/roles", (req, res) => {
		//TODO controllare i ruoli, solo admin può farlo

		try {
			const application = req.headers.application;
			const destapplication = req.query.application;

			if (!destapplication || destapplication == "BUILDER") {
				console.error("invalid app: " + destapplication);
				throw new Error("invalid app");
			}

			roleUtils
				.updateRole(destapplication, req.user, req.body.data)
				.then((data) => {
					res.send({ success: true });
				})
				.catch((error) => {
					console.error(`Update role error`, error);
					//res.send({ success: false, message: error.message });
					res.sendStatus(500);
				});
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});
};
