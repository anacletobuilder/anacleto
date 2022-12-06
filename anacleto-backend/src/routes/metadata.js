const logger = require("../utils/logger");
const metadataUtils = require("../utils/metadataUtils");
const scriptUtils = require("../utils/scriptutils");
const appUtils = require("../utils/appUtils");
const appsConfiguration = appUtils.getAppsConfigurations();
const tenatsConfiguration = appUtils.getTenants();
const superAdminUids = appUtils.getSuperAdmins();

module.exports = function (app) {
	app.get("/metadata", (req, res) => {
		//console.info(`metadata reqbody`, req.body);
		//console.info(`metadata requser`, req.user);

		let ret, metadataString;
		try {
			const isSuperAdmin = superAdminUids.indexOf(req.user.uid) > -1;

			const tenantRoles = req.user;
			const userTenatsConfiguration = tenatsConfiguration.filter(
				(_tenant) => {
					return tenantRoles[_tenant.tenant] || isSuperAdmin;
				}
			);

			let tenant = req.headers.tenant;
			if (!tenant && userTenatsConfiguration.length > 0) {
				//nessun tenant selezionato, prendo il primo
				tenant = userTenatsConfiguration[0].tenant;
			}

			let application = req.headers.application;
			if (application == "BUILDER") {
				metadataString = metadataUtils.getMetadataRawData({application});
			} else {
				if (!application) {
					//carica applicazione di default dell'utente
					const appsList = Object.keys(appsConfiguration);
					for (let appId in appsConfiguration) {
						if (
							(tenantRoles[tenant] &&
								tenantRoles[tenant][appId]?.length) > 0 ||
							isSuperAdmin
						) {
							//ha almeno un ruolo per questa app
							console.info(`Load default user app: ${appId}`);
							application = appId;
							break;
						}
					}
				}

				if (
					(tenantRoles[tenant] &&
						tenantRoles[tenant][application]?.length > 0) ||
					isSuperAdmin
				) {
					try {
						metadataString =
							metadataUtils.getMetadataRawData({application});
					} catch (e) {
						console.error(e.toString());
					}
				}
			}

			if (!metadataString) {
				metadataString = "{}";
			}

			const userAppList = [];
			for (let appId in appsConfiguration) {
				if (
					(tenantRoles[tenant] &&
						tenantRoles[tenant][appId]?.length > 0) ||
					isSuperAdmin
				) {
					userAppList.push({
						application: appId,
						description: appsConfiguration[appId].name,
					});
				}
			}

			ret = {};
			ret.metadata = JSON.parse(metadataString);
			ret.apps = userAppList;
			ret.tenants = userTenatsConfiguration;
			ret.success = true;
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}

		res.send(ret);
	});

	app.patch("/menu", (req, res) => {
		//TODO controlla ruoli
		try {
			const application = req.headers.application;
			const destapplication = req.query.application;
			const windowName = req.query.window;

			if (!destapplication || destapplication == "BUILDER") {
				console.error("invalid app: " + destapplication);
				throw new Error("invalid app");
			}

			const metaString =
				metadataUtils.getMetadataRawData({application:destapplication});
			let meta = scriptUtils._parseJsonWithFunctions(metaString);
			meta.menu = req.body.menu;

			metadataUtils
				.updateMetadata({application:destapplication, user:req.user, metadata:meta},)
				.then((data) => {
					res.send({ success: true });
				})
				.catch((error) => {
					console.error(`Create menu ${windowName} error`, error);
					//res.send({ success: false, message: error.message });
					res.sendStatus(500);
				});
		} catch (e) {
			console.error(`Error`, e);
			res.sendStatus(500);
		}
	});
};
