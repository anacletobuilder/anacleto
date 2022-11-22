/**
 * Classe di utilità per convertire pug in React
 * 
 * Es di input
 * div.flex.flex-row.flex-wrap
 *	span.flex-1 pippo
 *	span.flex-1 pluto
 * 
 * 
 * Es di output
 * {
 *   "tag": "div",
 *   "props": {
 *     "className": "flex flex-column"
 *   },
 *   "items": [
 *     {
 *       "tag": "span",
 *       "props": {
 *         "className": "p-text"
 *       },
 *       "items": [
 *         "pippo"
 *       ]
 *     },
 *     {
 *       "tag": "span",
 *       "props": {
 *         "className": "p-text"
 *       },
 *       "items": [
 *         "pluto"
 *       ]
 *     }
 *   ]
 * }
 * @author Luca Biasotto
 * 
 * @param {string} pugString
 */
class PubParser {

    TAG_REGEX = /([^. #]+)/;
    CLASS_REGEX = /(?<=\.)([^. #]+)/g;
    ID_REGEX = /(?<=#)([^. ]+)/;

    constructor(params) {
        this.pugString = params.pugString;
    }

    /**
     * Numero di tab all'inziio di una riga
     * @param {*} text 
     * @returns 
     */
    numberOfTabs(text){
        var count = 0;
        var index = 0;
        while (text.charAt(index++) === "\t") {
            count++;
        }
        return count;
    }

    /**
     * Converte la stringa pug in un oggetto
     * @returns 
     */
    toObject() {
        const _pugObj = [];
        const _tagStack = [];
        let _previusDeep = 0;

        this.pugString.split("\n")
            .map(row => {
                const rowDeep = this.numberOfTabs(row);
                const tagTypeMatch = row.trim().match(this.TAG_REGEX);
                const tagType =  tagTypeMatch ? tagTypeMatch[0] || "div" : "div";
                const tagIdMatch = row.trim().match(this.ID_REGEX);
                const tagId = tagIdMatch ? tagIdMatch[0] : null;
                const tagClasses = row.trim().match(this.CLASS_REGEX)?.join(" ");
                const contentIndex = row.indexOf(" ");
                const content = contentIndex > 0 ? row.substring(contentIndex+1) : null;

                const tag = {
                    type : tagType,
                    props : {},
                    items : []
                }
                if(tagId){
                    tag.props.id = tagId;
                }
                if(tagClasses){
                    tag.props.className = tagClasses;
                }
                if(content){
                    tag.items.push(content);
                }


                if(rowDeep === 0){
                    //aggiungo alla root
                    _pugObj.push(tag);
                }else{
                    //va aggiunto al livello giusto
                    if(_previusDeep === rowDeep){
                        //sono allo stesso livello
                        _tagStack.pop(); //butto via l'ultimo, sto passando a un altro nodo padre
                        _tagStack.slice(-1)[0].items.push(tag); //aggiungo questo tag al nodo in cima allo stack
                    }else if(_previusDeep < rowDeep){
                        //sto scendendo
                        _tagStack.slice(-1)[0].items.push(tag); //aggiungo questo tag al nodo in cima allo stack
                    }else if(_previusDeep > rowDeep){
                        //sto salendo
                        //_tagStack.slice(rowDeep-_previusDeep)[0].items.push(tag); 
                        _tagStack.splice(rowDeep); //tengo i primi elementi
                        _tagStack.slice(-1)[0].items.push(tag); //aggiungo questo tag al nodo in cima allo stack
                    }

                }
                _tagStack.push(tag)//salvo questo nodo come prossimo padre
                _previusDeep = rowDeep;
                return null;
            });

        return _pugObj;
    }

    toReact() {
        this.toObject();
        //TODO
    }



}

export default PubParser;