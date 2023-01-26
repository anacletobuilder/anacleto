import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import {
	createSearchParams,
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import TopBar from "../components/apptopbar/appTopbar";
import Window from "../components/window/window";
import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import { logout } from "../login/loginUtils";
import utils, { defaultMemoizeFunction } from "../utils/utils";
import ErrorPage from "../components/errorPage";
import { getToken } from "../login/loginUtils";
import i18n from "../i18n";
import { Toast } from "primereact/toast";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { DateTime } from "luxon";
import InputDialog from "../components/dialog/inputdialog";
import Dialog from "../components/window/dialog";
import Sidebar from "../components/window/sidebar";
import { AppFooter } from "../components/appfooter/appFooter";
import { useSelector, useDispatch } from 'react-redux';
import { selectApplication, selectContext, selectDestApplication, selectTenant, selectUserCredentials, setApplication, setDestApplication, setTenant } from "../reducers/context";
import { resetMetadata, selectApplications, selectMetadata, selectTenants, setApplications, setMenu, setName, setTenants } from "../reducers/metadata";
import PanelsContextComponent from "../contexts/panelsContext";
import ComponentsContextComponent, { ComponentsContext } from "../contexts/componentsContext";
import PropTypes from "prop-types";

const ApplicationBuilder = (props) => {
	const dispatch = useDispatch();
	//Context
	const context = useSelector(selectContext);
	const application = useSelector(selectApplication);
	const destApplication = useSelector(selectDestApplication);
	const tenant = useSelector(selectTenant);
	const userCredentials = useSelector(selectUserCredentials);

	//Metadata
	const metadata = useSelector(selectMetadata);
	const applications = useSelector(selectApplications);
	const tenants = useSelector(selectTenants);

	const toast = useRef(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const [_appChange, changeApp] = useState();
	const [metadataError, setMetadataError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [dialogSettings, setDialogSettings] = useState({});
	const [inputDialogSettings, setInputDialogSettings] = useState({});
	const [sidebarSettings, setSidebarSettings] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		if (props.application && props.application !== application) {
			dispatch(setApplication(props.application));
		}
	}, [props.application]);

	useEffect(() => {
		if (!_appChange) return;
		if (application === "BUILDER") {
			//dal builder non cambio app, cambio solo app di destinazione
			dispatch(setDestApplication(_appChange));
			//window.location.reload(false);
		} else {
			//applicazioni non builder, cambio l'app
			dispatch(setApplications([]));
			dispatch(setApplication(_appChange));
		}
	}, [_appChange]);

	useEffect(() => {
		//sovrascrivo la function navigate in modo da mantere i parametri base
		const _navigate = function (_window, _options) {
			//imposto lo stato di default
			const defaultSearchParams = {};
			if (application) {
				defaultSearchParams.application = application;
			}
			if (destApplication) {
				defaultSearchParams.destApplication = destApplication;
			}
			if (tenant) {
				defaultSearchParams.tenant = tenant;
			}
			const navigateSearchParams = {
				...defaultSearchParams,
				..._options.searchParams,
			};

			setSearchParams((prev) => ({ ...prev, navigateSearchParams }));
			navigate(
				`${_window}?${createSearchParams(navigateSearchParams).toString()}`,
				{
					state: _options.windowData
				}
			)
		};
		const utilsArgs = {
			userCredentials,
			navigate: _navigate,
			searchParams,
			confirmDialog,
			toast,
			setDialogSettings,
			setInputDialogSettings,
			setSidebarSettings,
			context,
			axios
		};
		window.utils = utils.init(utilsArgs);
		window.DateTime = DateTime;
		window.t = i18n.t;
	}, [context, searchParams, userCredentials]);

	useEffect(() => {
		if (
			application && tenant &&
			(application !== "BUILDER" || destApplication) && //se è il builder ci deve essere anche destapplication
			(searchParams.get("application") !== application ||
				searchParams.get("tenant") !== tenant ||
				searchParams.get("destapplication") !== destApplication) //è cambiato qualcosa
		) {
			let params = Object.fromEntries(searchParams.entries());

			const newParams = {};
			if (tenant && tenant !== "null" && tenant !== "undefined") {
				newParams.tenant = tenant;
			}
			if (
				application &&
				application !== "null" &&
				application !== "undefined"
			) {
				newParams.application = application;
			}
			if (
				destApplication &&
				destApplication !== "null" &&
				destApplication !== "undefined"
			) {
				newParams.destApplication = destApplication;
			}
			setSearchParams({ ...params, ...newParams });
		}
	}, [application, destApplication, tenant, userCredentials]);

	useEffect(() => {
		if (userCredentials.username) {
			fetchData(application);
		}
	}, [application, tenant, userCredentials]);
	/**
	 * Carica i metadati dell'applicazione
	 * @param {String} application
	 */
	const fetchData = (application) => {
		let _token;
		const _i18nResourceBundle = application;

		getToken()
			.then((token) => {
				_token = token;
				return Promise.resolve()
			}).then((token) => {
				//load app metadata
				const headers = {
					Authorization: _token,
					application,
					tenant,
				};

				return axios.get(
					`${process.env.REACT_APP_BACKEND_HOST}/metadata`,
					{
						headers,
						timeout: 60000,
					}
				);
			})
			.then((res) => {
				if (
					(!res.success && res.message === "autherror") ||
					(!res.data.success && res.data.message === "autherror")
				) {
					logout();
					props.setUsername(null);
					return;
				}

				const _metadata = res.data.metadata;
				const availableApps = res.data.apps;
				const availableTenants = res.data.tenants;

				dispatch(setApplications(availableApps));
				dispatch(setTenants(availableTenants));

				if (!tenant && availableTenants && availableTenants[0]) {
					//At least 1 tenant, set it as the active tenant
					dispatch(setTenant(availableTenants[0].tenant));
				}
				let waitingApp = false;
				if (!application && availableApps && availableApps[0]) {
					//At least 1 application, try to load it
					dispatch(setApplication(availableApps[0].application));
					waitingApp = true;
				}

				if (_metadata && _metadata.application) {
					dispatch(setName(_metadata.name));
					dispatch(setMenu(_metadata.menu));
					dispatch(setApplication(_metadata.application));

					document.title = _metadata.name;

					if (application === "BUILDER" && availableApps.length > 0) {
						//dal builder non cambio app, cambio solo app di destinazione

						//se l'app di destinazione non è stata specificata la setto
						const tempDestApp = destApplication || availableApps[0].application;
						if (searchParams.get("application") !== _metadata.application || searchParams.get("destapplication") !== tempDestApp) { }

						dispatch(setDestApplication(destApplication || availableApps[0].application));
					}

					setMetadataError(false);
				} else {
					if (!waitingApp) {
						//If there is no metadata and no application can be selected, show error
						dispatch(resetMetadata());
						setMetadataError(true);
					}
				}

				setIsLoading(false);
			})
			.then(() => {
				//check translation
				if (!i18n.hasLoadedNamespace(_i18nResourceBundle)) {
					//download translation bundle
					return axios.get(
						`${process.env.REACT_APP_BACKEND_HOST}/locales/${i18n.language}`,
						{
							timeout: 5000,
							headers: {
								Authorization: _token,
								application,
								tenant,
							},
						}
					);
				}

				return Promise.resolve();
			})
			.then((resp) => {
				//Load app bundle translation
				if (resp?.data) {
					return i18n.addResourceBundle(
						i18n.language,
						_i18nResourceBundle,
						resp.data,
						true,
						true
					);
				}
				return Promise.resolve();
			})
			.catch((e) => {
				console.error(e);
				dispatch(resetMetadata());
				setMetadataError(true);
				setIsLoading(false);
			});
	};

	return (
		<React.Fragment>
			<TopBar
				logout={props.logout}
				changeApp={changeApp}
				changeTenant={setTenant}
				changeTheme={props.changeTheme}
				applications={applications}
				application={metadata?.application}
				destApplication={destApplication}
				tenants={tenants}
				tenant={tenant}
				metadata={metadata}
				userCredentials={userCredentials}
			></TopBar>
			{isLoading && (
				<div className="layout-main-container h-screen w-screen flex flex-1 align-content-center flex-wrap card-container blue-container -mb-6">
					<ProgressSpinner strokeWidth={4} />
				</div>
			)}

			{!isLoading && metadataError && (
				<ErrorPage
					code=" "
					title="Sorry"
					message="Error while loading app :("
				/>
			)}
			{!isLoading && !metadataError && !metadata && applications?.length > 0 && (
				<ErrorPage
					code=" "
					title="Welcome"
					message="Please select a valid application"
				/>
			)}
			{!isLoading && metadata && applications?.length === 0 && (
				<ErrorPage
					code=" "
					title="Sorry"
					message="You don't have access to any applications"
				/>
			)}

			{!isLoading && metadata && applications?.length > 0 && (
				<React.Fragment>
					<ComponentsContextComponent>
						<RegisterComponentListener application={application}>
							<PanelsContextComponent>
								<Toast ref={toast} />

								<InputDialog
									settings={inputDialogSettings}
									setInputDialogSettings={setInputDialogSettings}
								/>

								<ConfirmDialog />

								<Dialog
									id="dialogWindow"
									context={context}
									settings={dialogSettings}
									setDialogSettings={setDialogSettings}
									metadata={metadata}
									userCredentials={userCredentials}
									confirmDialog={confirmDialog}
									toast={toast}
								/>
								<Sidebar
									id={"sidebar"}
									settings={sidebarSettings}
									application={application}
									destApplication={destApplication}
									tenant={tenant}
									metadata={metadata}
									userCredentials={userCredentials}
									setSidebarSettings={setSidebarSettings}
									confirmDialog={confirmDialog}
									toast={toast}
								/>

								<Window />
							</PanelsContextComponent>
						</RegisterComponentListener>
					</ComponentsContextComponent>
				</React.Fragment>
			)}

			<AppFooter metadata={metadata} />
		</React.Fragment>
	);
}

/* Register component listener (could not listen inside of ApplicationBuilder because it must be a children of the ComponentsContext) */
const RegisterComponentListener = ({ application, children }) => {
	const { registerComponents } = useContext(ComponentsContext);
	useEffect(() => {
		(async () => {
			if (application === 'BUILDER') {
				//If application is BUILDER, import register the builder-only components
				const { default: MemoFlow } = await import('../components/builder/flow');
				const { default: MemoPreview } = await import('../components/builder/preview');
				const { default: MemoFieldEditor } = await import('../components/builder/fieldEditor');

				registerComponents({
					MemoFlow,
					MemoPreview,
					MemoFieldEditor,
				});
			}
		})();
	}, [application]);

	return children;
}
const MemoApplicationBuilder = React.memo(ApplicationBuilder, (prev, next) => {
	return defaultMemoizeFunction(ApplicationBuilder.propTypes, prev, next);
});
MemoApplicationBuilder.displayName = "ApplicationBuilder";
ApplicationBuilder.propTypes = {
	application: PropTypes.string,
	windowId: PropTypes.string,
}
export default MemoApplicationBuilder;
