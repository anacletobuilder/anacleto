const backendContext = {
    application: "Anacleto application code",
    req: {
        __description__: "Anacleto request",
        method: "Contains a string corresponding to the HTTP method of the request: GET, POST, PUT, and so on.",
        path: "Contains the path part of the request URL.",
        protocol: "Contains the request protocol string: either http or(for TLS requests) https.",
        query: "This property is an object containing a property for each query string parameter in the route",
        headers: "Request headers map",
        body: "key-value pairs of data submitted in the request body",
        get: function () {
            return {
                detail: 'req.get <string>(field: string)',
                documentation: "Returns the specified HTTP request header field(case-insensitive match).The Referrer and Referer fields are interchangeable.",
                insertText: 'get("${1:field}")',
            }
        }
    },
    logger: {
        __description__: "Anacleto logger library. An alternativo to console log",
        log: function () { },
        info: function () { },
        warn: function () { },
        error: function () { },
    },
    utils: {
        __description__: "Anacleto utils library",
        uuid: function () {
            return {
                detail: 'utils.uuid <string>()',
                documentation: "Returns an UUID",
                insertText: 'uuid()'
            }
        }
    },
    googleDatastore: {
        __description__: "Anacleto Google Datastore library",
        getEntity: function () {
            return {
                detail: 'googleDatastore.getEntity <Promise>({entityName: string, entityKey: string})',
                documentation: "Get a Google Datastore entity\n\n" +
                    "@param - entityName Entity name\n" +
                    "@param - entityKey Entity key",
                insertText: 'getEntity({entityName:"${1:params}",entityKey:${2:string}})\n' +
                    '\t.then((res) => {})\n' +
                    '\t.catch((err) => {});'
            }
        },
        insertEntity: function () {
            return {
                detail: 'googleDatastore.insertEntity <Promise>({entityName: string, entity: map, entityAttributes: map})',
                documentation: "Insert an entity on Google Datastore\n\n" +
                    "@param - entityName Entity name\n" +
                    "@param - entity Entity object key value map\n" +
                    "@param - entityAttributes Entity attributes map",
                insertText: 'insertEntity({entityName:"${1:params}",entity:${2:string},entityAttributes:${3:string}})\n' +
                    '\t.then((res) => {})\n' +
                    '\t.catch((err) => {});'
            }
        },
        updateEntity: function () {
            return {
                detail: 'googleDatastore.updateEntity <Promise>({entityName: string, entityKey: string, entity: map, entityAttributes: map})',
                documentation: "Updaate an entity on Google Datastore\n\n" +
                    "@param - entityName Entity name\n" +
                    "@param - entityKey Entity\n" +
                    "@param - entity Entity object key value map\n" +
                    "@param - entityAttributes Entity attributes map",
                insertText: 'updateEntity({entityName:"${1:params}",entityKey:"${2:params}",entity:${3:string},entityAttributes:${4:string}})\n' +
                    '\t.then((res) => {})\n' +
                    '\t.catch((err) => {});'
            }
        },
        deleteEntity: function () {
            return {
                detail: 'googleDatastore.deleteEntity <Promise>({entityName: string, entityKey: string})',
                documentation: "Delete a Google Datastore entity\n\n" +
                    "@param - entityName Entity name\n" +
                    "@param - entityKey Entity key",
                insertText: 'deleteEntity({entityName:"${1:params}",entityKey:${2:string}})\n' +
                    '\t.then((res) => {})\n' +
                    '\t.catch((err) => {});'
            }
        },
        list: function () {
            return {
                detail: 'googleDatastore.list <Promise>({entityName: string}) (+1 override)',
                documentation: "List a Google Datastore entities\n\n" +
                    "@param - entityName Entity name\n" +
                    "@param - select Array of fields to extract\n" +
                    "@param - filters Array of filter condition {property,value,operator}\n" +
                    "@param - order Order clouse {property,descending}\n" +
                    "@param - limit\n" +
                    "@param - offset\n",
                insertText: 'list({entityName:"${1:params}",entityKey:${2:string}})\n' +
                    '\t.then((res) => {})\n' +
                    '\t.catch((err) => {});'
            }
        }
    },
    mysql: {
        __description__: "Anacleto library for working with MySQL.",
        query: function () {
            return {
                detail: 'mysql.query <Promise>({db: string, query: string, values: array, timeout: int, nestTables: boolean})',
                documentation: "Execute MySQL query",
                insertText: 'query({db:"${1:params}",query:${2:string}, timeout:${3:millis}, values:${4:array}, nestTables:${5:boolean} })',
            }
        },
        getConnection: function () {
            return {
                detail: 'mysql.getConnection <Promise>({db: string})',
                documentation: "Get MySQL connection\n" +
                    "@param - db connection name",
                insertText: 'query({db:"${1:dbname}"})',
            }
        },
        escape: function () {
            return {
                detail: 'mysql.escape <string>(value: object) (+1 overload)',
                documentation: "Escape an untrusted string to be used as a SQL value.\n\n" +
                    "@param - value Value to escape\n" +
                    "@param - optional, stringifyObjects If true, don't convert objects into SQL lists\n" +
                    "@param - optional, timeZone Convert dates from UTC to the given timezone.",
                insertText: 'escape({value:"${1:value}"})',
            }
        },
        escapeId: function () {
            return {
                detail: 'mysql.escapeId <string>(value: object) (+1 overload)',
                documentation: "Escape an untrusted string to be used as a SQL identifier (database,table, or column name) \n\n" +
                    "@param - value Value to escape\n" +
                    "@param - optional, forbidQualified Don't allow qualified identifiers (eg escape '.')",
                insertText: 'escapeId({value:"${1:value}"})',
            }
        },
        transactionBlock: function () {
            return {
                detail: 'mysql.transactionBlock <void>(connectionName: object, txBody:async function) (+1 overload)',
                documentation: "Execute txBody block on a transction, in case of error it do a roolback \n\n" +
                    "@param - connectionName Connection name\n" +
                    "@param - txBody asyn function",
                insertText: 'transactionBlock("${1:connectionName}", async (_db) => {\n\t${2: params }\n})'

            }
        }
    },
};

const backendSnippets = [
    {
        label: 'ifelse',
        filterText: 'ifelse',
        kind: "Snippet",
        insertText: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'].join('\n'),
        documentation: 'If-Else Statement',
        sortText: "0"
    },
    {
        label: 'Anacleto: query',
        kind: "Snippet",
        insertText: 'const queryArgs = {\n\tdb: "${1:params}",\n\tsql: `${2:query}`,\n\tvalues: [${3:params}],\ntimeout: 5 * 1000,\n}\n\nreturn mysql.query(queryArgs)\n' +
            '\t.catch((e) => {\n\t\tconsole.error("Query error", e);\n\t\treturn Promise.resolve({ success: false });\n})',
        documentation: 'Anacleto query snippet',
        sortText: "0"
    },
    {
        label: 'Anacleto: transaction',
        kind: "Snippet",
        insertText: 'mysql.transactionBlock("ASPORTO", async (_db) => {\n'+
            '\t//transaction block code\n'+
            '\tconsole.info("Start transaction"); \n'+
            '\tconst queryArgs = {\n'+
            '    \t\tdb: ${1:params}, \n'+
            '    \t\tsql: ${2:params}, \n'+
            '    \t\tvalues: {\n'+
            '        \t\t\n'+
            '        \t\t\n'+
            '    }\n'+
            '    \t\n'+
            '}\n'+
            '\tvar insertRes = await _db.query(queryArgs); \n'+
            '}) \n'+
            '\t.then(res => {})\n'+
            '\t.catch(err => {})',
        documentation: 'Anacleto query snippet',
        sortText: "0"
    }




];

function last(myArray) {
    return myArray.at(-1)
}


function showAutocompletion(monaco, options) {
    // Register object that will return autocomplete items
    return monaco?.languages.registerCompletionItemProvider(
        "javascript",
        getSuggestions(monaco, options)
    );
}

const specialCharactersForWordSplitting = ["(", "="];

//convert kind string to type
function getKind(monaco, kind) {
    switch (kind) {
        case "Class":
            return monaco.languages.CompletionItemKind.Class;
        case "Color":
            return monaco.languages.CompletionItemKind.Color;
        case "Constant":
            return monaco.languages.CompletionItemKind.Constant;
        case "Constructor":
            return monaco.languages.CompletionItemKind.Constructor;
        case "Customcolor":
            return monaco.languages.CompletionItemKind.Customcolor;
        case "Enum":
            return monaco.languages.CompletionItemKind.Enum;
        case "EnumMember":
            return monaco.languages.CompletionItemKind.EnumMember;
        case "Event":
            return monaco.languages.CompletionItemKind.Event;
        case "Field":
            return monaco.languages.CompletionItemKind.Field;
        case "File":
            return monaco.languages.CompletionItemKind.File;
        case "Folder":
            return monaco.languages.CompletionItemKind.Folder;
        case "Function":
            return monaco.languages.CompletionItemKind.Function;
        case "Interface":
            return monaco.languages.CompletionItemKind.Interface;
        case "Issue":
            return monaco.languages.CompletionItemKind.Issue;
        case "Keyword":
            return monaco.languages.CompletionItemKind.Keyword;
        case "Method":
            return monaco.languages.CompletionItemKind.Method;
        case "Module":
            return monaco.languages.CompletionItemKind.Module;
        case "Operator":
            return monaco.languages.CompletionItemKind.Operator;
        case "Property":
            return monaco.languages.CompletionItemKind.Property;
        case "Reference":
            return monaco.languages.CompletionItemKind.Reference;
        case "Snippet":
            return monaco.languages.CompletionItemKind.Snippet;
        case "Struct":
            return monaco.languages.CompletionItemKind.Struct;
        case "Text":
            return monaco.languages.CompletionItemKind.Text;
        case "TypeParameter":
            return monaco.languages.CompletionItemKind.TypeParameter;
        case "Unit":
            return monaco.languages.CompletionItemKind.Unit;
        case "User":
            return monaco.languages.CompletionItemKind.User;
        case "Value":
            return monaco.languages.CompletionItemKind.Value;
        case "Variable":
            return monaco.languages.CompletionItemKind.Variable;
    }
}

// Helper function to return the monaco completion item type of a thing
function getType(monaco, value, isMember = false) {
    switch ((typeof value).toLowerCase()) {
        case "object":
            return monaco.languages.CompletionItemKind.Class;

        case "function":
            return isMember
                ? monaco.languages.CompletionItemKind.Method
                : monaco.languages.CompletionItemKind.Function;

        default:
            return isMember
                ? monaco.languages.CompletionItemKind.Property
                : monaco.languages.CompletionItemKind.Variable;
    }
}

function getDetail(monaco, value) {

    switch ((typeof value).toLowerCase()) {
        case "string":
            return value;
        case "object":
            return value.__description__ || JSON.stringify(value);
        case "function":
            return `(method) ${value().detail}`;
        default:
            return JSON.stringify(value);
    }
}

function getDocumentation(monaco, value) {

    switch ((typeof value).toLowerCase()) {
        case "function":
            return value().documentation;
        default:
            return null;
    }
}

function getInsertText(monaco, prop, value) {

    switch ((typeof value).toLowerCase()) {
        case "function":
            return value().insertText || prop;
        default:
            return prop;
    }
}

function getSuggestions(monaco, options) {

    const context = {};
    if (options.scope === 'backend') {
        Object.assign(context, backendContext);
    }

    const snippets = [];
    if (options.scope === 'backend') {
        backendSnippets.forEach(snippet => {
            snippet.kind = getKind(monaco, snippet.kind);
            snippet.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
        });
        snippets.push(...backendSnippets);
    }

    /* eslint-disable */
    // NOTE: this code segment was taken(modified) from the following git gist
    // https://gist.github.com/mwrouse/05d8c11cd3872c19c684bd1904a2202e
    return {
        triggerCharacters: ["."],

        // Function to generate autocompletion results
        provideCompletionItems(model, position) {

            // Split everything the user has typed on the current line up at each space, and only look at the last word
            const lastChars = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            });
            const words = lastChars.replace("\t", "").split(" ");

            let activeTyping = last(words); // What the user is currently typing (everything after the last space)

            specialCharactersForWordSplitting.forEach((char) => {
                if (activeTyping.includes(char)) {
                    activeTyping = last(activeTyping.split(char));
                }
            });

            // Array of autocompletion results
            const suggestions = [];
            suggestions.push(...snippets)

            /*
            if (!Object.keys(context).some((key) => activeTyping.startsWith(key))) {
                // Here, we are interested only in these cases where the active typing starts
                // with one of the first level keys of "context" object.
                // For example, the common "context" object for NodeEditor will look like this:
                // { context: { user: { id: ..., name: ..., email: ... }, classes: { ... }, ... } }
                // In this particular case, we are interested only in the case where activeTyping starts with the word
                // "context". In all other cases, we return "null" to force the monaco to fall back to the next suggest provider
                // read more about this issue here - https://github.com/microsoft/monaco-editor/issues/2646
                return { suggestions };
            }
            */

            // If the last character typed is a period then we need to look at member objects of the `context` object
            const isMember = activeTyping.charAt(activeTyping.length - 1) === ".";


            // Used for generic handling between member and non-member objects
            let lastToken = context;
            let prefix = "";

            if (isMember) {
                // Is a member, get a list of all members, and the prefix
                const parents = activeTyping
                    .substring(0, activeTyping.length - 1)
                    .split(".");
                lastToken = context[parents[0]];
                prefix = parents[0];

                // Loop through all the parents the current one will have (to generate prefix)
                parents.forEach((parent) => {
                    if (lastToken?.hasOwnProperty(parent)) {
                        prefix += `.${parent}`;
                        lastToken = lastToken[parent];
                    } else {
                        // Not valid
                        return suggestions;
                    }
                });

                prefix += ".";
            }

            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };

            // Get all the child properties of the last token
            for (const prop in lastToken) {
                // Do not show properites that begin with "__"
                if (lastToken.hasOwnProperty(prop) && !prop.startsWith("__")) {
                    // Create completion object

                    const completionItem = {
                        label: prop,
                        kind: getType(monaco, lastToken[prop], isMember),
                        insertText: getInsertText(monaco, prop, lastToken[prop]),
                        //detail: JSON.stringify(get(context, prefix + prop)),
                        detail: getDetail(monaco, lastToken[prop]),
                        documentation: getDocumentation(monaco, lastToken[prop]),
                        sortText: "1",
                        range
                    };

                    // Change insertText for functions
                    /*
                    if (
                        completionItem.kind ===
                        monaco.languages.CompletionItemKind.Function ||
                        completionItem.kind === monaco.languages.CompletionItemKind.Method
                    ) {
                        completionItem.insertText += "(";
                    }
                    */

                    if (completionItem.insertText.indexOf("${") > -1) {
                        completionItem.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
                    }

                    // Add to final suggestionss
                    suggestions.push(completionItem);
                }
            }


            return { suggestions };
        }
    };
}

export { showAutocompletion };
