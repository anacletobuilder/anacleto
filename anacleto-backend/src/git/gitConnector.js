/**
 * Docs: https://isomorphic-git.org/en/
 * 
 */
const logger = require('../utils/logger');
const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
const fs = require('fs')
const fsPromises = require('fs').promises;
const appUtils = require("../utils/appUtils");
const gitSampleApp = require('./gitSampleApp');


class GitConnector {

    constructor(namespace) {
        if (!process.env.GIT_SYNC_DIR) {
            console.error("No GIT_SYNC_DIR");
            this.appsRootPath = undefined;
        } else {
            this.appsRootPath = path.join(process.env.GIT_SYNC_DIR);
        }

    }

    /**
     * Ritorna l'auth per il git specificato nell'applicazione
     */
    getAuth(app) {
        if (!app || !app.oauth2format) {
            return undefined;
        }

        return () => ({
            oauth2format: app.oauth2format,
            password: app.password,
            username: app.username
        });
    }

    /**
     * Clona l'app passata nel repository specificato
     * @param {String} appName 
     */
    async cloneApp(app) {
        if (!app) {
            return Promise.reject(new Error(`App ${app} not found on .env file`));
        }
        console.info(`Start cloning app: ${app.id}`)

        const appId = app.id;
        const repository = app.repository;
        const dir = appUtils.getAppFolder(appId);

        console.info(`Sync ${appId} on ${dir} started...`);


        if (!fs.existsSync(dir)) {
            //clono il repository
            return git.clone({
                fs,
                http,
                dir,
                url: repository,
                onAuth: this.getAuth(app)
            }).then((resp) => {
                return this.initAppRepository({ appId, dir })
            })
        } else {
            //faccio il checkout con force=true
            return git.checkout({
                fs,
                dir,
                force: true,
                onAuth: this.getAuth(app)
            }).then(() => {
                return git.pull({
                    fs,
                    http,
                    dir,
                    author: {
                        name: "Anacleto",
                        email: "pull@anacleto.orgx",
                    },
                    onAuth: this.getAuth(app)
                })
            }).then((resp) => {
                return Promise.resolve({ appId, dir })
            }).then((resp) => {
                return this.initAppRepository({ appId, dir })
            })
        }
    }

    /**
     * Scrive il file passato e fa il push su git
     */
    async writeFile(application, user, realtivePath, fileContent) {
        const appdir = path.join(this.appsRootPath, application);
        const gitdir = path.join(appdir, ".git");
        const absolutedir = path.join(appdir, realtivePath);
        const appConfigration = appUtils.getAppConfiguration(application);

        return fsPromises.mkdir(path.dirname(absolutedir), { recursive: true })
            .then((data) => fsPromises.writeFile(absolutedir, fileContent, 'utf-8'))
            .then((data) => {
                if (!appConfigration.repository) {
                    console.warn(`Git reposity non configured for app ${application}`)
                    return Promise.resolve();
                }

                return git.add({
                    fs,
                    dir: appdir,
                    gitdir: gitdir,
                    filepath: realtivePath
                })
                    .then((data) => git.commit({
                        fs,
                        dir: realtivePath,
                        gitdir: gitdir,
                        author: {
                            name: user.name,
                            email: user.email,
                        },
                        message: `${user.name} update file ${realtivePath}`
                    }))
                    .then((data) => {
                        //docs auth https://isomorphic-git.org/docs/en/authentication.html
                        return git.push({
                            fs,
                            http,
                            dir: realtivePath,
                            gitdir: gitdir,
                            onAuth: this.getAuth(appConfigration),
                        })
                    })

            })
    }

    async deleteFile(application, user, realtivePath) {
        const appdir = path.join(this.appsRootPath, application);
        const gitdir = path.join(appdir, ".git");

        const absolutedir = path.join(appdir, realtivePath);

        return fsPromises.rm(absolutedir, { recursive: true })
            .then((data) => {
                if (!appConfigration.repository) {
                    console.warn(`Git reposity non configured for app ${application}`)
                    return Promise.resolve();
                }

                return git.remove({
                    fs,
                    dir: appdir,
                    gitdir: gitdir,
                    filepath: realtivePath
                })
                    .then((data) => git.commit({
                        fs,
                        dir: realtivePath,
                        gitdir: gitdir,
                        author: {
                            name: user.name,
                            email: user.email,
                        },
                        message: `${user.name} update file ${realtivePath}`
                    }))
                    .then((data) => {
                        //docs auth https://isomorphic-git.org/docs/en/authentication.html
                        const appConfigration = appUtils.getAppConfiguration(application);
                        return git.push({
                            fs,
                            http,
                            dir: realtivePath,
                            gitdir: gitdir,
                            onAuth: this.getAuth(appConfigration),
                        })
                    })
            })
    }



    /**
     * If empty init the app repository
     * @param {string} dir 
     */
    async initAppRepository({ appId, dir }) {
        /**
         * windows/
         * wndows/home.json
         * roles/
         * roles/role.json
         * scrpts/
         * metadata.json
         */

        const gitdir = path.join(dir, ".git");

        const metadata = path.join(dir, "metadata.json");
        const i18n = path.join(dir, "i18n.json");
        const windows = path.join(dir, "windows");
        const home = path.join(windows, "home.json");
        const homeIt = path.join(windows, "home.it.json");
        const roles = path.join(dir, "roles");
        const role = path.join(roles, "role.json");
        const scripts = path.join(dir, "scripts");

        console.log(`Check app repository ${appId}: ${dir}`)

        fsPromises.access(metadata)
            //CHECK METADATA
            .then(() => {
                console.log(`- metadata.json ok`)
                return Promise.resolve()
            })
            .catch(() => {
                console.log(`- metadata.json ko, create default`)

                const metadataObj = gitSampleApp.METADATA;
                metadataObj.application = appId;
                metadataObj.name = appId;

                return fsPromises.writeFile(metadata, JSON.stringify(metadataObj, null, 4))
                    .then((data) => git.add({
                        fs,
                        dir: dir,
                        gitdir: gitdir,
                        filepath: "metadata.json"
                    }))
            })
            //CHECK APP TRANSLATION
            .then(() => {
                return fsPromises.access(i18n)
            })
            .then(() => {
                console.log(`- i18n.json ok`)
                return Promise.resolve()
            })
            .catch(() => {
                console.log(`- i18n.json ko, create default`)
                return fsPromises.writeFile(i18n, JSON.stringify(gitSampleApp.I18N, null, 4))
                    .then((data) => git.add({
                        fs,
                        dir: dir,
                        gitdir: gitdir,
                        filepath: "i18n.json"
                    }))
            })
            //CHECK WINDOWS
            .then(() => {
                return fsPromises.access(windows)
            })
            .catch(() => {
                console.log(`- create windows folder`)
                return fsPromises.mkdir(windows)
            })
            .then(() => {
                return fsPromises.access(home)
            })
            .then(() => {
                console.log(`- home.json ok`)
                return Promise.resolve()
            })
            .catch(() => {
                console.log(`- home.json ko, create default`)
                return fsPromises.writeFile(home, JSON.stringify(gitSampleApp.HOME, null, 4))
                    .then((data) => git.add({
                        fs,
                        dir: dir,
                        gitdir: gitdir,
                        filepath: "windows/home.json"
                    }))
                    .then(() => {
                        console.log(`- home.json ko, create default it translation`)
                        return fsPromises.writeFile(homeIt, JSON.stringify(gitSampleApp.HOME_IT, null, 4))
                            .then((data) => git.add({
                                fs,
                                dir: dir,
                                gitdir: gitdir,
                                filepath: "windows/home.it.json"
                            }))
                    })
            })
            //CHECK ROLES
            .then(() => {
                return fsPromises.access(roles)
            })
            .catch(() => {
                console.log(`- create roles folder`)
                return fsPromises.mkdir(roles)
            })
            .then(() => {
                return fsPromises.access(role)
            })
            .then(() => {
                console.log(`- role.json ok`)
                return Promise.resolve()
            })
            .catch(() => {
                console.log(`- role.json ko, create default`)

                return fsPromises.writeFile(role, JSON.stringify(gitSampleApp.ROLE, null, 4))
                    .then((data) => git.add({
                        fs,
                        dir: dir,
                        gitdir: gitdir,
                        filepath: "roles/role.json"
                    }))
            })
            //CHECK SCRIPTS
            .then(() => {
                return fsPromises.access(scripts)
            })
            .catch(() => {
                console.log(`- create scripts folder`)
                return fsPromises.mkdir(scripts)
                    .then(() => {
                        console.log(`- create sample script 1`)
                        return fsPromises.writeFile(path.join(scripts, "sample.js"), gitSampleApp.SCRIPT_1);
                    })
                    .then((data) => git.add({
                        fs,
                        dir: dir,
                        gitdir: gitdir,
                        filepath: "scripts/sample.js"
                    }))
                    .then(() => {
                        console.log(`- create sample script 2`)
                        return fsPromises.writeFile(path.join(scripts, "owls_list.js"), gitSampleApp.SCRIPT_2);
                    })
                    .then((data) => git.add({
                        fs,
                        dir: dir,
                        gitdir: gitdir,
                        filepath: "scripts/owls_list.js"
                    }))
                    .then(() => {
                        console.log(`- create sample script 1`)
                        return fsPromises.writeFile(path.join(scripts, "sample_store.js"), gitSampleApp.SCRIPT_3);
                    })
                    .then((data) => git.add({
                        fs,
                        dir: dir,
                        gitdir: gitdir,
                        filepath: "scripts/sample_store.js"
                    }))
            })
            //COMMIT ALL
            .then((data) => git.commit({
                fs,
                dir: "",
                gitdir: gitdir,
                author: {
                    name: "Anacleto init",
                    email: "anacleto@nomail.xxx",
                },
                message: `Anacleto init`
            }))
            .then((data) => {
                //docs auth https://isomorphic-git.org/docs/en/authentication.html
                const appConfigration = appUtils.getAppConfiguration(appId);
                return git.push({
                    fs,
                    http,
                    dir: "",
                    gitdir: gitdir,
                    onAuth: this.getAuth(appConfigration),
                })
            })
            .then(res => {
                return Promise.resolve({ appId, dir })
            })

    }

}

module.exports = new GitConnector();