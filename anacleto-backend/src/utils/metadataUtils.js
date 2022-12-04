const fs = require("fs");
const appUtils = require("./appUtils");
const gitConnector = require("./../git/gitconnector");
const path = require("path");
const { getFileSha: getFileSha } = require("./fileUtils");

class MetadataUtils {

	/**
	 * Return metadata path relative to Git Folder
	 * @returns
	 */
	getMetadataRelativePath() {
		return path.join("metadata.json");
	}

	/**
	 * Get absolute metadata path
	 * @param {string} application application id
	 * @returns
	 */
	getMetadataAbsolutePath({ application }) {
		return path.join(
			appUtils.getAppFolder(application),
			this.getMetadataRelativePath()
		);
	}



	/**
	 * Get Metadata string
	 * @param {string} application application id
	 * @returns metadata string data
	 */
	getMetadataRawData({ application }) {
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

		const metdataPath = this.getMetadataAbsolutePath({ application });

		if (!fs.existsSync(metdataPath)) {
			return null;
		}

		return fs.readFileSync(metdataPath, "utf8");
	}

	/**
	 * Update metadata
	 * @param {string} application
	 * @param {string} user
	 * @param {object} metadata
	 */
	updateMetadata({application, user, metadata}) {
		if (!application || !metadata) {
			//la finestra esiste già
			return Promise.reject(new Error("missing metadata data"));
		}

		if (!this.getMetadataRawData({ application })) {
			//i meta non esistono...
			return Promise.reject(new Error("metadata not exists"));
		}
		const metaPath = this.getMetadataRelativePath();
		return gitConnector.writeFile(
			application,
			user,
			metaPath,
			JSON.stringify(metadata, null, 2)
		);
	}

/**
	 * Return window translations raw data
	 * 
	 * @param {string} application application id
	 * @param {string} language  language code ISO2
	 * @returns translation object
	 */
 getAppTranslationsRawData({application, language}) {
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

	const i18nLanguagePath = path.join(appUtils.getAppFolder(application),
		`i18n${language ? "." + language.toLowerCase() : ""}.json`)

	if (fs.existsSync(i18nLanguagePath)) {
		return fs.readFileSync(i18nLanguagePath, "utf8")
	}

	const i18nPath = path.join(appUtils.getAppFolder(application), `i18n.json`)
	if (fs.existsSync(i18nPath)) {
		return fs.readFileSync(i18nPath, "utf8")
	}

	return JSON.stringify({})
}


	/**
	 * Return window translations
	 * 
	 * @param {string} application application id
	 * @param {string} language  language code ISO2
	 * @returns translation object
	 */
	getAppTranslations({application, language}) {
		return JSON.parse(this.getAppTranslationsRawData({application, language}))
	}

	/**
	 * Add app language translations
	 * @param {string} application id
	 * @param {string} language code ISO2
	 * @returns 
	 */
	addAppLanguage({ application, user, language }) {
		if (!application || application === "BUILDER") {
			return Promise.reject(`Invalid application not found`);
		}

		if (language.length != 2) {
			return Promise.reject(`Invalid language ${language}`);
		}

		const appConfigration = appUtils.getAppConfiguration(application);
		if (!appConfigration) {
			console.error(`App ${application} not found in .env file`);
			return Promise.reject(`App ${application} not found`);
		}

		const translationRelativePath = `i18n.${language.toLowerCase()}.json`
		const i18nLanguagePath = path.join(appUtils.getAppFolder(application), translationRelativePath);
		if (fs.existsSync(i18nLanguagePath)) {
			return Promise.reject(`Language ${language} already exists`);
		}

		return gitConnector.writeFile(
			application,
			user,
			translationRelativePath,
			JSON.stringify({})
		);

	}

	/**
	 * Update app language
	 * @param {string} application 
	 * @param {string} user 
	 * @param {string} language, if not set update default translations 
	 * @param {string} source 
	 * @param {string} clientSha 
	 * @returns 
	 */
	updateAppLanguage({ application, user, language, source, clientSha }) {
		if (!application || application === "BUILDER") {
			return Promise.reject(`Invalid application not found`);
		}

		if (language && language.length != 2) {
			return Promise.reject(`Invalid language ${language}`);
		}

		const appConfigration = appUtils.getAppConfiguration(application);
		if (!appConfigration) {
			console.error(`App ${application} not found in .env file`);
			return Promise.reject(`App ${application} not found`);
		}

		const translationRelativePath = `i18n${language ? "." + language.toLowerCase() : ""}.json`
		//const appPath = appUtils.getAppFolder(application);
		const i18nLanguagePath = path.join(appUtils.getAppFolder(application), translationRelativePath);
		if (!fs.existsSync(i18nLanguagePath)) {
			return Promise.reject(`Language ${language} not exists`);
		}

		const originalFileSource = fs.readFileSync(i18nLanguagePath, "utf8");

		//check versione
		const serverSha = getFileSha(originalFileSource);
		if (clientSha != serverSha) {
			return Promise.reject(new Error('fail_sha'));
		}


		return gitConnector.writeFile(
			application,
			user,
			translationRelativePath,
			source
		);

	}


	/**
	 * Delete app languages
	 * @param {*} application 
	 * @param {*} id 
	 * @param {*} scriptData 
	 */
	deleteAppLanguage({ application, user, language }) {


		if (!application || application === "BUILDER") {
			return Promise.reject(`Invalid application not found`);
		}

		if (!language || language.length != 2) {
			return Promise.reject(`Invalid language ${language}`);
		}

		const translationRelativePath = `i18n.${language.toLowerCase()}.json`
		const i18nLanguagePath = path.join(appUtils.getAppFolder(application), translationRelativePath);
		if (!fs.existsSync(i18nLanguagePath)) {
			return Promise.reject(`Language ${language} not exists`);
		}


		return gitConnector.deleteFile(application, user, translationRelativePath);
	}

	/**
	 * Get array of available app translations language
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
