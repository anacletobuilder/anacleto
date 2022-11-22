import i18next, {t} from 'i18next'

/**
 * Get a function for traslate item
 * @param {application, window} params
 * @returns 
 */
function getTranslator({ application, window }){
    if(!application){
        throw "getTranslator requires application"
    }
    //get application translations
    const tApp = application ? i18next.getFixedT(null, `${application}`) : null;
    //get window translations
    const tWindow = window ? i18next.getFixedT(null, `${application}.${window}`) : null;

    return (id, label) =>{
        if (tWindow){
            //search in order:
            //  1. id in window translation
            //  2. label in window translation
            //  3. label in app translation
            return tWindow(id, tWindow(label, tApp(label)));
        }
        return tApp(id, tApp(label));
    }
}

export { getTranslator }