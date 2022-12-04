const fs = require("fs");
const appUtils = require("./appUtils");
const gitConnector = require("./../git/gitconnector");
const path = require("path");
const { getFileSha: getFileSha } = require("./fileUtils");

class MetadataUtils {
	/**
	 * Ritorna il path relativo del file dei metdati rispetto a git
	 * @returns
	 */
	getMetadataRelativePath() {
		return path.join("metadata.json");
	}

	/**
	 * Ritorna il path assoluto del file dei metadati
	 * @param {*} application
	 * @returns
	 */
	getMetadataAbsolutePath(application) {
		return path.join(
			appUtils.getAppFolder(application),
			this.getMetadataRelativePath()
		);
	}



	/**
	 * Ritorna l'oggetto di una finestra
	 * @param {string} application application id
	 * @returns metadata string data
	 */
	getMetadataRawData(application) {
		if (!application) {
			throw "Application required!";
		}

		if (application == "BUILDER") {
			const metaPath = path.join(
				__dirname,
				"../builder",
				"metadata.json"
			);
			return fs.readFileSync(metaPath, "utf8");
		}

		const appConfiguration = appUtils.getAppConfiguration(application);
		if (!appConfiguration) {
			console.error(`App ${application} not found in .env file`);
			return null;
		}

		const metdataPath = this.getMetadataAbsolutePath(application);

		if (!fs.existsSync(metdataPath)) {
			return null;
		}

		return fs.readFileSync(metdataPath, "utf8");
	}

	/**
	 * * Aggiorna i metadati
	 * @param {*} application
	 * @param {*} user
	 * @param {*} metadataData
	 */
	updateMetadata(application, user, metadataData) {
		if (!application || !metadataData) {
			//la finestra esiste già
			return Promise.reject(new Error("missing metadata data"));
		}

		if (!this.getMetadataRawData(application)) {
			//i meta non esistono...
			return Promise.reject(new Error("metadata not exists"));
		}
		const metaPath = this.getMetadataRelativePath();
		return gitConnector.writeFile(
			application,
			user,
			metaPath,
			JSON.stringify(metadataData, null, 2)
		);
	}

	/**
	 * Return window translations
	 * 
	 * @param {string} appId application id
	 * @param {string} window  window name
	 * @param {string} language  language
	 * @returns translation object
	 */
	getAppTranslations(application, language) {
		if (!application) {
			throw "Application required!";
		}

		if (application == "BUILDER") {
			const metaPath = path.join(
				__dirname,
				"../builder",
				"i18n.json"
			);
			return fs.readFileSync(metaPath, "utf8");
		}

		const appConfiguration = appUtils.getAppConfiguration(application);
		if (!appConfiguration) {
			console.error(`App ${application} not found in .env file`);
			return null;
		}

		const i18nLanguagePath = path.join(appUtils.getAppFolder(application), `i18n${language ? "." + language.toLowerCase(): ""}.json`);
		if (fs.existsSync(i18nLanguagePath)) {
			return fs.readFileSync(i18nLanguagePath, "utf8");
		}

		const i18nPath = path.join(appUtils.getAppFolder(application), `i18n.json`);
		if (fs.existsSync(i18nPath)) {
			return fs.readFileSync(i18nPath, "utf8");
		}


		return {}
	}

	/**
	 * Add app language
	 * @param {string} application 
	 * @param {string} language 
	 * @returns 
	 */
	addAppLanguage({application, user, language}){
		if (!application || application === "BUILDER") {
			return Promise.reject(`Invalid application not found`);
		}

		if(language.length != 2){
			return Promise.reject(`Invalid language ${language}`);
		}

		const appConfigration = appUtils.getAppConfiguration(application);
		if (!appConfigration) {
			console.error(`App ${application} not found in .env file`);
			return Promise.reject(`App ${application} not found`);
		}

		//const appPath = appUtils.getAppFolder(application);
		const i18nLanguagePath = path.join(appUtils.getAppFolder(application), `i18n.${language.toLowerCase()}.json`);
		if (fs.existsSync(i18nLanguagePath)) {
			return Promise.reject(`Language ${language} already exists`);
		}

		const translationRelativePath = `i18n.${language.toLowerCase()}.json`

		return gitConnector.writeFile(
			application,
			user,
			translationRelativePath,
			JSON.stringify({}, null, 2)
		);

	}

	/**
	 * 
	 * @param {string} application 
	 * @param {string} user 
	 * @param {string} language 
	 * @param {string} source 
	 * @param {string} clientSha 
	 * @returns 
	 */
	updateAppLanguage({application, user, language, source, clientSha}){
		if (!application || application === "BUILDER") {
			return Promise.reject(`Invalid application not found`);
		}

		if(language && language.length != 2){
			return Promise.reject(`Invalid language ${language}`);
		}

		const appConfigration = appUtils.getAppConfiguration(application);
		if (!appConfigration) {
			console.error(`App ${application} not found in .env file`);
			return Promise.reject(`App ${application} not found`);
		}

		//const appPath = appUtils.getAppFolder(application);
		const i18nLanguagePath = path.join(appUtils.getAppFolder(application), `i18n${language ? "." + language.toLowerCase(): ""}.json`);
		if (!fs.existsSync(i18nLanguagePath)) {
			return Promise.reject(`Language ${language} not exists`);
		}

		const originalFileSource = fs.readFileSync(i18nLanguagePath, "utf8");
		
		 //check versione
		 const serverSha = getFileSha(originalFileSource);
		 if(clientSha != serverSha){
			 return Promise.reject(new Error('fail_sha'));
		 }

		const translationRelativePath = `i18n${language ? "." + language.toLowerCase(): ""}.json`

		return gitConnector.writeFile(
			application,
			user,
			translationRelativePath,
			source
		);

	}

	/**
	 * Get 
	 * @param {String} application 
	 * @returns 
	 */
	getAppLanguages({ application }) {
		if (!application) {
			throw "Application required!"
		}

		if (application == "BUILDER") {
			return ["en"]
		}

		const appConfigration = appUtils.getAppConfiguration(application);
		if (!appConfigration) {
			console.error(`App ${application} not found in .env file`);
			return Promise.reject(`App ${application} not found`);
		}

		const appPath = appUtils.getAppFolder(application);
		const files = fs.readdirSync(appPath)
		return files.filter(file => {
			return file.startsWith("i18n.")
		})
	}
}

module.exports = new MetadataUtils();
