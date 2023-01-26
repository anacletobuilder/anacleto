console.log("[middleware] loading firebase-config...");
const admin = require("../config/firebase-config");
const logger = require("../utils/logger");
const appUtils = require("../utils/appUtils");
const superAdminUids = appUtils.getSuperAdmins();

class Middleware {
	async decodeToken(req, res, next) {
		if (!req.headers.authorization) {
			return res.json({ success: false, message: "unauthorize" });
		}

		//const token = (req.originalUrl.indexOf("/scripts.js") == 0 && req.query.token) ? req.query.token : req.headers.authorization.split(' ')[1];
		const token = req.headers.authorization.split(" ")[1];
		try {
			const decodeValue = await admin.auth().verifyIdToken(token);
			//console.log(decodeValue);
			if (decodeValue) {
				req.user = decodeValue;
				return next();
			}
			return res.json({ success: false, message: "unauthorize" });
		} catch (e) {
			console.error(e); //todo si può togliere
			return res.json({ success: false, message: "autherror" });
		}
	}

	async checkRoles(req, res, next) {
		logger.debug(`Check request role!`);

		if (req.url === "/metadata") {
			//TODO mmmm va bene così?
			next();
		} /*åelse if (req.url.startsWith("/locales/")) {
			//TODO mmmm va bene così?
			next();
		}*/ else {
			const tenant = req.headers.tenant;
			if (!tenant) {
				next("missing_tenant");
			} else {
				let tenantRoles = req.user[tenant];
				if (!tenantRoles && req.user.string) {
					//il ruolo è stato compresso
					tenantRoles = claimsToObject(req.user);
				}

				const isSuperAdmin = superAdminUids.indexOf(req.user.uid) > -1;
				if (isSuperAdmin) {
					next();
				} else if (
					!tenant ||
					!tenantRoles ||
					!tenantRoles.length === 0
				) {
					//tenant non abilitato
					next("missing_role");
				} else {
					//passa il controllo all'handler successivo
					next();
				}
			}
		}
	}
}

module.exports = new Middleware();
