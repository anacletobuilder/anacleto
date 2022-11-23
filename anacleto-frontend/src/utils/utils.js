import {getToken as getLoginToken} from '../login/loginUtils'
/**
 * Classe di utilità lato client, singola istanza
 *
 * @param {string} userCredential
 * @param {object} navigate
 * @param {object} searchParams
 */
class Utils {
	constructor() {}
	init(params) {
		this.userCredential = params.userCredential;
		this.navigate = params.navigate;
		this.searchParams = params.searchParams;
		this.confirmDialog = params.confirmDialog;
		this.toast = params.toast;
		this.setDialogSettings = params.setDialogSettings;
		this.setInputDialogSettings = params.setInputDialogSettings;
		this.setSidebarSettings = params.setSidebarSettings
		this.setDialogForwardData = params.setDialogForwardData;
		this.context = params.context;
		return this;
	}

	//ESEMPIO metodi
	/*
	static showAllert = (params) => {
		alert(params.message);
	}
	getQualcosa = (message) => {
		return "qualcosa";
	}*/

	/**
	 * ritorna le credenziali di logid di firbasen, con ruoli ecc ecc
	 * @return ritorna le credenziali di logid di firbasen, con ruoli ecc ecc
	 */
	getUserCrential = () => {
		return this.userCredential;
	};

	/**
	 * Ritrona token firebase auth
	 * @return token firebase auth
	 */
	getToken = () => {
		return getLoginToken();
		
		//ho fatto un tentativo per fare l'autorefresh
		// // Verify the ID token while checking if the token is revoked by passing
		// // checkRevoked true.
		// debugger;
		// let checkRevoked = true;
		// return auth.verifyIdToken(this.userCredential.token, checkRevoked)
		// 	.then((payload) => {
		// 		// Token is valid.
		// 		debugger;
		// 		return Promise.resolve(this.userCredential)
		// 	})
		// 	.catch((error) => {
		// 		debugger;
		// 		if (error.code === 'auth/id-token-revoked') {
		// 			// Token has been revoked. Inform the user to reauthenticate or signOut() the user.
		// 			return auth.currentUser.getIdTokenResult()
		// 		} else {
		// 			// Token is invalid.
		// 			console.log(`Fail to refresh token`, error);
		// 			return Promise.reject(`Invalid token`);
		// 		}
		// 	})
		// 	.then((idTokenResult) => {
		// 		debugger;
		// 		/*
		// 		setUserCredential({
		// 			username: userCred.email,
		// 			token: idTokenResult.token,
		// 			claims: idTokenResult.claims
		// 		});
		// 		*/
		// 		return Promise.resolve(idTokenResult.token)
		// 	})
	};

	/**
	 * ritorna il parametro dell'url
	 * @param {string} paramName
	 */
	getSearchParam = (paramName) => {
		if (this.searchParams) {
			return this.searchParams.get(paramName);
		}
		return null;
	};
	/**
	 * Chiama uno script server
	 * @param {Object} params
	 * @param {string} script
	 * @param {string|null} method
	 * @param {Object} body
	 * @returns
	 */
	executeServerScript = (params) => {
		const script = params.script;
		const method = params.method;
		const body = params.body;

		const serverArgs = {
			method: method || "post",
			url: `/processScript`,
			data: body,
			params: {
				script: script,
			},
		};
		return this.callServer(serverArgs);
	};

	/**
	 * Esegue una chiamata autenticata al server
	 * @param {string} url
	 * @param {Object} params
	 * @param {string} script
	 * @param {string|null} method
	 * @param {Object} body
	 * @param {Object} headers
	 * @returns
	 */
	callServer = (params) => {
		return this.getToken()
			.then(_token => {
				const url = params.url;
				const method = params.method;
				const data = params.data;
				const urlParams = params.params;
				const contentType = params.contentType;

				const headers = Object.assign(
					{
						Authorization: _token,
						"Content-Type": contentType || "application/json",
						tenant: this.context.tenant,
						application: this.context.application,
						destapplication: this.context.destApplication,
					},
					params.headers
				);

				const axios = require("axios");
				return axios({
					method: method || "post",
					baseURL: `${process.env.REACT_APP_BACKEND_HOST}`,
					url: url,
					timeout: 60000,
					params: urlParams,
					headers: headers,
					data: data,
				});
			});
	};

	/**
	 * Oggetto da convertire in una stringa con funzioni
	 * @param {Object} obj Oggetto da convertire
	 * @returns String
	 */
	_stringifyJsonWithFunctions = (obj) => {
		if (!obj) {
			return obj;
		}

		//Preso un oggetto devo renderlo un JSON
		return JSON.stringify(obj, function (key, val) {
			if (typeof val == "function") {
				var body = val.toString();
				if (body.length < 8 || body.substring(0, 8) !== "function") {
					return "_ArrFun_" + body;
				} else {
					return "" + body;
				}
			} else {
				return val;
			}
		});
	};

	/**
	 * Funzione per convertire stringa json con funzioni in oggetto
	 * @param {String} json Stringa contenente funzioni
	 * @param {Bool} date2obj Parametro per convertire la data da stringa a oggetto new Date
	 * @returns Object
	 */
	_parseJsonWithFunctions = (json, date2obj) => {
		if (!json) {
			return json;
		}
		return JSON.parse(json, function (key, val) {
			var iso8061 = date2obj
				? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/
				: false;
			var prefix;
			if (typeof val != "string") {
				return val;
			}
			if (val.length < 8) {
				return val;
			}
			prefix = val.substring(0, 8);
			if (iso8061 && val.match(iso8061)) {
				return new Date(val);
			}
			if (prefix === "function" || prefix === "_ArrFun_") {
				//Devo estrarre gli args e dividerli dal body
				var args = /\(\s*([^)]+?)\s*\)/.exec(val);
				if (args[1]) {
					args = args[1].split(/\s*,\s*/);
				} else {
					args = [];
				}
				var body = val.substring(val.indexOf("{") + 1, val.length - 1);
				var newFunct = new Function(args, body);
				return newFunct;
			}
			return val;
		});
	};

	setDialogSettings = this.setDialogSettings;
	setSidebarSettings = this.setSidebarSettings;

	/**
	 * Apre la finestra specificata
	 * @param {string} window
	 * @param {object} searchParams
	 */
	openWindow = (params) => {
		const window = params.window;
		const searchParams = { ...{ tenant: this.context.tenant, application: this.context.application }, ...params.searchParams };
		const type = params.type || "window";
		var settings = params.settings || {};
		this.setDialogForwardData(params.forwardData || {});

		switch(type){
			case 'modal': case 'dialog':{
				settings.windowId = window;
				settings.visible = true;
				this.setDialogSettings(settings);
			}break;
			case 'sidebar':{
				settings.windowId = window;
				settings.visible = true;
				this.setSidebarSettings(settings);
			}break;
			default:{
				const options = {
					searchParams: searchParams,
				};
		
				this.navigate(window, options);
			}
		}
	};

	/**
	 * Mostra un dialog di conferma
	 * @param {string} header
	 * @param {string} message
	 * @param {string} icon
	 * @param {string} acceptClassName
	 * @param {function} accept
	 * @param {function} reject
	 */
	showConfirmDialog = (params) => {
		this.confirmDialog(params);
	};

	/**
	 *
	 * @param {string} header
	 * @param {string} message
	 * @param {string} icon
	 * @param {string} defaultValue
	 * @param {string} acceptClassName
	 * @param {function} validate must return {success:true|false, message:error message}
	 * @param {function} accept
	 * @param {function} reject
	 */
	showInputDialog = (params) => {
		params = Object.assign(params, { visible: true });
		this.setInputDialogSettings(params);
	};

	/**
	 * Metto a disposizione l'intera variabile toast se può essere utile per fare lavori di fino
	 */
	toast = this.toast;

	/**
	 * Mostra un toast
	 * @param {*} params
	 */
	showToast = (params) => {
		this.toast.current.show(params);
	};

	getControlsList = () => {
		return [
			"form",
			"grid",
			"tabView",
			"tree",
			"gridcontainer",
			"button",
			"toggleButton",
			"textInput",
			"textareaInput",
			"autoComplete",
			"dropdown",
			"numberInput",
			"switchInput",
			"checkbox",
			"icon",
			"image",
			"text",
			"avatar",
		];
	};
	getDefaultControlsConfig = (type, whatYouWant) => {
		let config = {};
		let events = [];
		switch (type) {
			//Finestre
			case "window":
				config = { window: "", items: [], events: {} };
				events = [];
				break;
			//Tipi di pannelli
			case "form":
				config = {
					id: "",
					type: "form",
					store: "",
					isCard: false,
					toggleable: false,
					title: "",
					mode: "",
					dataModel: "",
					className: "",
					events: {},
					items: [],
				};
				events = [{ code: "afterRender", description: "afterRender" }];
				break;
			case "grid":
				config = {
					id: "",
					type: "grid",
					store: "",
					listId: "",
					title: "",
					className: "",
					isCard: false,
					toggleable: false,
					sortable: false,
					removableSort: false,
					columns: [],
					paginator: false,
					stripedRows: false,
					tableSize: "large",
					scrollHeight: "flex",
					isEditable: false,
					editMode: "row",
					dataKey: "id",
					emptyMessage: "No data",
					events: {},
					items: [],
				};
				events = [
					{
						code: "onSelectionChange",
						description: "onSelectionChange",
					},
					{ code: "afterRender", description: "afterRender" },
				];
				break;
			case "tabView":
				config = {
					id: "",
					type: "tabView",
					title: "",
					className: "",
					isCard: false,
					toggleable: false,
					events: {},
					items: [],
				};
				events = [];
				break;
			case "tree":
				config = {
					id: "",
					type: "tree",
					store: "",
					title: "",
					background: "",
					isCard: false,
					filterMode: "lenient",
					toggleable: false,
					className: "",
					events: {},
					items: [],
				};
				events = [
					{ code: "onExpand", description: "onExpand" },
					{ code: "onCollapse", description: "onCollapse" },
					{ code: "onSelect", description: "onSelect" },
					{ code: "onUnselect", description: "onUnselect" },
					{ code: "onContextMenu", description: "onContextMenu" },
				];
				break;
			case "gridcontainer":
				config = {
					id: "",
					type: "gridcontainer",
					layout: "grid",
					title: "",
					events: {},
					items: [],
				};
				events = [];
				break;
			//Controlli
			case "button":
				config = {
					id: "",
					type: "button",
					colNumber: "",
					fieldClassName: "",
					className: "",
					label: "",
					icon: "",
					events: {},
				};
				events = [{ code: "onClick", description: "onClick" }];
				break;
			case "toggleButton":
				config = {
					id: "",
					type: "toggleButton",
					colNumber: "",
					onIcon: "",
					offIcon: "",
					onLabel: "",
					offLabel: "",
					style: "",
					className: "",
					checked: "",
					tabIndex: "",
					iconPos: "",
					tooltip: "",
					tooltipOption: "",
					events: {},
				};
				events = [{ code: "onChange", description: "onChange" }];
				break;
			case "textInput":
				config = {
					id: "",
					type: "textInput",
					colNumber: "",
					fieldClassName: "",
					className: "",
					value: "",
					hasFloatingLabel: true,
					disabled: false,
					label: "",
					events: {},
				};
				events = [
					{ code: "onChange", description: "onChange" },
					{ code: "onBlur", description: "onBlur" },
					{ code: "validate", description: "Validate" },
				];
				break;
			case "textareaInput":
				config = {
					id: "",
					type: "textareaInput",
					colNumber: "",
					fieldClassName: "",
					className: "",
					value: "",
					hasFloatingLabel: true,
					disabled: false,
					label: "",
					events: {},
				};
				events = [
					{ code: "onChange", description: "onChange" },
					{ code: "onBlur", description: "onBlur" },
				];
				break;
			case "autoComplete":
				config = {
					id: "",
					type: "autoComplete",
					colNumber: "",
					fieldClassName: "",
					className: "",
					descriptionField: "description",
					availableValuesField: "rolesAvailable",
					filterField: "description",
					hasFloatingLabel: true,
					disabled: false,
					label: "",
					events: {},
				};
				events = [];
				break;
			case "dropdown":
				config = {
					id: "",
					type: "dropdown",
					colNumber: "",
					name: "",
					value: "",
					options: "",
					optionLabel: "",
					optionValue: "",
					optionDisabled: "",
					optionGroupLabel: "",
					optionGroupChildren: "",
					style: "",
					className: "",
					scrollHeight: "",
					filter: false,
					filterBy: "",
					filterMatchMode: "",
					filterPlaceholder: "",
					filterLocale: "",
					emptyMessage: "",
					emptyFilterMessage: "",
					resetFilterOnHide: false,
					editable: false,
					placeholder: "",
					required: false,
					disabled: false,
					autoFocus: false,
					filterInputAutoFocus: false,
					showFilterClear: false,
					panelClassName: "",
					panelStyle: "",
					dataKey: "",
					inputId: "",
					showClear: false,
					maxLength: null,
					ariaLabel: "",
					ariaLabelledBy: "",
					dropdownIcon: "",
					showOnFocus: false,
					events: {},
				};
				events = [
					{ code: "onChange", description: "onChange" },
					{ code: "onMouseDown", description: "onMouseDown" },
					{ code: "onContextMenu", description: "onContextMenu" },
					{ code: "onFocus", description: "onFocus" },
					{ code: "onBlur", description: "onBlur" },
					{ code: "onFilter", description: "onFilter" },
				];
				break;
			case "numberInput":
				config = {
					id: "",
					type: "numberInput",
					colNumber: "",
					fieldClassName: "",
					className: "",
					value: 0,
					hasFloatingLabel: true,
					disabled: false,
					label: "",
					events: {},
				};
				events = [];
				break;
			case "switchInput":
				config = {};
				events = [];
				break;
			case "checkbox":
				config = {
					id: "",
					type: "checkbox",
					fieldClassName: "",
					className: "",
					hasFloatingLabel: false,
					value: "",
					disabled: true,
					label: "",
					events: {},
				};
				events = [
					{ code: "onChange", description: "onChange" },
					{ code: "onBlur", description: "onBlur" },
				];
				break;
			case "icon":
				config = { id: "", type: "icon", className: "", fontSize: "" };
				events = [];
				break;
			case "image":
				config = {};
				break;
			case "tag":
				config = {
					id: "",
					type: "tag",
					fieldClassName: "",
					className: "",
					severity: "",
					label: "",
					rounded: "",
				};
				break;
			case "avatar":
				config = {
					id: "",
					type: "avatar",
					fieldClassName: "",
					className: "",
					size: "large",
					label: "",
					icon: "",
					image: "",
				};
				break;
			case "action":
				config = { label: "", icon: "", events: {}, actions: [] };
				events = [{ code: "onClick", description: "onClick" }];
				break;
			default:
				config = {
					id: "",
					type: "text",
					fieldClassName: "",
					className: "",
					value: "",
				};
				break;
		}
		if (whatYouWant == "events") {
			return events;
		}
		return config;
	};

	renderHtmlString = (htmlString) => {
		return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
	};
	/*
	shareRenderFunc=function() {
		ReactDOM.render(
			<Share/> , document.getElementById('shareContainer')
		)
	};
	*/
}

export default new Utils();
export const defaultMemoizeFunction = (propTypes, prevProps, nextProps) => {
	const arePropsSame = Object.keys(propTypes).filter((p) => prevProps[p] !== nextProps[p]).map((d) => {
		//console.log(`Changed prop ${d} for component ${prevProps.id}`, prevProps[d], nextProps[d]);
	}).length === 0;
	//console.log(`Component ${prevProps.id} has ${arePropsSame ? 'the same' : 'different'} props. ${arePropsSame ? 'NO ' : ''}render is necessary.`);
	return arePropsSame;
}
//Internal function to convert metadata events to JS Functions
export const getFunctionFromMetadata = (functionObj) => {
	if(functionObj.constructor == Function){
		//Is already a function, just return it
		return functionObj;
	}else if(!functionObj.body){
		let msg = 'Events must be defined as eventName: { parameters: "parameter1, parameter2, ..., parameterN", body: "return ..." }.';
		console.warn(msg);
		return () => (console.warn(msg));
	}else{
		//console.log("Converting metadata to function for component " + component, functionObj);
		try{
			return new Function(functionObj.parameters || "", functionObj.body);
		}catch(e){
			console.error(e);
			return () => (console.error(e));
		}
	}
}