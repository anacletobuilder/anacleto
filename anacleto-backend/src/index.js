function Anacleto() {

	console.log(`
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%@@@@@@
@@@@@@@%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%%%@@@@@@
@@@@@@@%%%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%%%%%%%@@@@@@
@@@@@@@%%%%% .%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%%%%%  %%%%%@@@@@@
@@@@@@@%%%%%     %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#     %%%%%@@@@@@
@@@@@@@%%%%%           %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%           %%%%%@@@@@@
@@@@@@@%%%%%           .......................,*,*******,.           %%%%%@@@@@@
@@@@@@@%%%%%        ............................,,,,,,,,,,,,,        %%%%%@@@@@@
@@@@@@@@%%%%     ................................*******,*******     %%%%@@@@@@@
@@@@@@@@@@    %%%%%%%%%%%%%%%%.....................%%%%%%%%%%%%%%%%    @@@@@@@@@
@@@@@@@@@@ %%%%%%%%%%#%%%%%%%%%%%...............%%%%%%%%%%##%%%%%%%%%% @@@@@@@@@
@@@@@@@@@%%%%%%             %%%%%%,.........../%%%%%%            .%%%%%%@@@@@@@@
@@@@@@@@%%%%%                 %%%%%%.........%%%%%%                 %%%%%@@@@@@@
@@@@@@@%%%%%         %%        %%%%%/.......#%%%%%        %%         %%%%%@@@@@@
@@@@@@@%%%%%       %%%%%        %%%%%......,%%%%%        %%%%(       %%%%%@@@@@@
@@@@@@@%%%%%(                  %%%%%%%.....%%%%%%%                  #%%%%@@@@@@@
@@@@@@@@%%%%%%                %%%%%%%%%...%%%%%%%%%                %%%%%%@@@@@@@
@@@@@@@../%%%%%%            %%%%%%.%%%%%.%%%%%.%%%%%%            %%%%%%*,*@@@@@@
@@@@@@...../%%%%%%%%%%%%%%%%%%%%....%%%%%%%%%....%%%%%%%%%%%%%%%%%%%%***,**@@@@@
@@@@@..........%%%%%%%%%%%%%%........%%%%%%%........%%%%%%%%%%%%%%,*,*,*,*,*@@@@
@@%%%%%%..............................%%%%%..............*******,*******,%%%%%%@
@%%%%%%%%%%%...........................%%%...............***,***,***,%%%%%%%%%%%
@%%%%%.%%%%%%%...........................................,******,**%%%%%%%*%%%%%
@%%%%*....%%%%%%.........................................,,,,,,,,%%%%%%,,,,*%%%%
@%%%%.......%%%%%%.............*/......,/,....../*.......******%%%%%%***,***%%%%
@%%%%/........%%%%%%........../////.../////.../////......***,#%%%%%*,***,**/%%%%
@%%%%%.........%%%%%%....................................***%%%%%%******,**%%%%%
@%%%%%...........%%%%%...................................*,%%%%%%*,*,*,*,*,%%%%%
@@%%%%%........../%%%%#.........../////.../////.........,*%%%%%%,*******,*%%%%%@
@@@%%%%%..........%%%%%............//,.....*/*..........,*%%%%%*,***,***,%%%%%@@
@@@@%%%%%%..........%..................................*,**(%***,******%%%%%%@@@
@@@@@%%%%%%...........................................,,,,,,,,,,,,,,,,%%%%%%@@@@
@@@@@@@%%%%%%.........................................**,*******,***%%%%%%@@@@@@
@@@@@@@@@%%%%%%%.....................................***,***,***,%%%%%%%@@@@@@@@
@@@@@@@@@@@%%%%%%%%.................................****,*****%%%%%%%%@@@@@@@@@@
@@@@@@@@@@@@@@%%%%%%%%%%...........................*,*,*,%%%%%%%%%%@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%@@@@@@@@@@@@@@@@@@@@@@@@`);

	try {
		console.log(`loading dotenv...`);
		require("dotenv").config({ path: __dirname + "/../.env" });
		console.log(`loading process...`);
		const { env } = require("process");
		console.log(`loading winston...`);
		const winston = require("winston");
		console.log(`loading express-winston...`);
		const expressWinston = require("express-winston");
		console.log(`loading express...`);
		const express = require("express");
		console.log(`loading cors...`);
		const cors = require("cors");
		console.log(`loading middleware...`);
		const middleware = require("./middleware");
		console.log(`loading appUtils...`);
		const appUtils = require("./utils/appUtils");
		console.log(`loading gitConnector...`);
		const gitConnector = require("./git/gitconnector");
		console.log(`loading bodyParser...`);
		const bodyParser = require("body-parser");
		console.log(`loading mySqlConnector...`);
		const MySqlConnector = require("./crud/mysqlconnector");
		const DatastoreConnector = require("./crud/datastoreConnector");

		console.log(`load end!`);

		console.info(`
                ┌────────────────────────────────┐
                │ ANACLETO IS STARTING...        │
                └────────────────────────────────┘
		`);

		/*********************************************************************
		 *                          SINCRONIZZA APPS
		 * Recupera da Git i sorgenti delle app configurate nel file .env
		 *********************************************************************/

		const appsConfiguration = appUtils.getAppsConfigurations();

		let clonePromies = [];
		for (let appId in appsConfiguration) {
			if (appId.indexOf("_") === 0) {
				continue;
			}

			console.info(`Load app configuration ${appId}...`);
			const appConfgituration = appUtils.getAppConfiguration(appId);
			clonePromies.push(gitConnector.cloneApp(appConfgituration));
		}

		console.info(`Start cloning apps..`)
		Promise.all(clonePromies)
			.then((response) => {
				console.info(`Cloning apps end`, response)
			})
			.catch((error) => console.error(`cloneApp fail!`, error));

		/*********************************************************************
		 *                          AVVIO EXPRESS
		 *********************************************************************/

		const app = express();
		app.use(cors());

		//aggiungo middleware controlla il login
		app.use(middleware.decodeToken);

		//aggiungo middleware  parse automatico
		app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
		app.use(bodyParser.json()); // parse application/json

		/*********************************************************************
		 *                                LOGS
		 *********************************************************************/
		//logga tutte le richieste di express
		/*app.use(
			expressWinston.logger({
				transports: [
					new winston.transports.Console({
						json: true,
						colorize: true,
					}),
				],
				meta: true, // optional: control whether you want to log the meta data about the request (default to true)
				msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
				expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
				colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
				ignoreRoute: function (req, res) {
					return false;
				}, // optional: allows to skip some log messages based on request and/or response
			})
		);*/

		app.use(
			expressWinston.errorLogger({
				transports: [
					new winston.transports.Console({
						json: true,
						colorize: true,
					}),
				],
			})
		);

		/*********************************************************************
		 *                  CONNESSIONE DATABASE MySQL
		 **********************************************************************/
		let mySqlConnector;
		try {
			const dbsSettings = JSON.parse(env.DB_MYSQL);
			mySqlConnector = new MySqlConnector();
			mySqlConnector.init(dbsSettings);
		} catch (e) {
			console.error("MySQL Connection error:", e);
		}

		/*********************************************************************
		 *                  CONNESSIONE GOOGLE DATASTORE
		 **********************************************************************/
		let datastoreConnector;
		try {
			datastoreConnector = new DatastoreConnector();
		} catch (e) {
			console.error("DatastoreConnector Connection error:", e);
		}


		/*********************************************************************
		 *                          CONTROLLO RUOLI
		 **********************************************************************/
		app.all("*", middleware.checkRoles);

		/*********************************************************************
		 *                          IMPORT ROUTES
		 **********************************************************************/
		require("./routes/metadata")(app);
		require("./routes/windows")(app);
		require("./routes/scripts")(app, {mySqlConnector, datastoreConnector});
		require("./routes/auth")(app);
		require("./routes/settings")(app);
		require("./routes/translations")(app);

		// All other GET requests not handled before will return our React app
		app.get("*", (req, res) => {
			//res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
			res.json({ success: false });
		});

		/**
		 * Avvio server
		 */
		const PORT = process.env.PORT || 3001; //TODO spostare su file .env
		app.listen(PORT, () => {
			console.info(`
                ┌──────────────────────────────────────┐
                │ ANACLETO IS LISTENING ON PORT:${PORT}
                └──────────────────────────────────────┘
			`);
		});
	} catch (e) {
		console.error(e);
	}

}

module.exports = Anacleto
