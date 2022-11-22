const fs = require('fs');
const path = require('path')


class AppUtils {

    /**
     * Return apps root path
     * @returns 
     */
    getAppsRoot() {
        return path.join(process.env.GIT_SYNC_DIR);
    }

    /**
     * Get a specific app sync folder
     */
    getAppFolder(application) {
        return path.join(this.getAppsRoot(), application);
    }

    /**
     * Return all apps configuration
     */
    getAppsConfigurations() {
        try{
            return JSON.parse(process.env.APPS);
        }catch(e){
            console.error(`Cannot get app configuration, check APPS in .env file`, e);
            console.error(e);
        }

        throw "Fail get APPS"
    }

    /**
     * Return app configuration
     * @param {string} application 
     */
    getAppConfiguration(application) {
        const appsConfiguration = this.getAppsConfigurations()
        return appsConfiguration[application];
    }


    /**
     * Return all tenants
     */
    getTenants() {
        
        try{
            return JSON.parse(process.env.TENANTS);
        }catch(e){
            console.error(`Cannot get app tenants, check TENANTS in .env file`, e);
            console.error(e);
        }

        throw "Fail get TENANTS"
    }

    /**
     * Return UID of super admins
     */
    getSuperAdmins() {
        try{
            return JSON.parse(process.env.SUPER_ADMIN_UIDS);
        }catch(e){
            console.error(`Cannot get super admins, check SUPER_ADMIN_UIDS in .env file`, e);
            console.error(e);
        }

        throw "Error get super SUPER_ADMIN_UIDS"
    }


}

module.exports = new AppUtils();