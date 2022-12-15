import React, { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { classNames } from "primereact/utils";
import ErrorPage from "../errorPage";
import { getToken } from "../../login/loginUtils";
import i18n from "../../i18n";
import MemoComponent from "../component";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectApplication, selectDestApplication, selectTenant, setWindow } from "../../reducers/context";

function Window(props) {
	const dispatch = useDispatch();
	const tenant = useSelector(selectTenant);
	const application = useSelector(selectApplication);
	const destApplication = useSelector(selectDestApplication);

	 const params = useParams()
	 const windowId = params.windowId || 'home'

	const [windowMetadata, setWindowMetadata] = useState(null);
	const [loadError, setLoadError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchData(windowId);
	}, [tenant, application, destApplication, windowId]);


	useEffect(() => {
		dispatch(setWindow(windowId))
	}, [windowId]);


	const fetchData = (windowId) => {
		if (!windowId) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		let _token;
		const _i18nResourceBundle = `${application}.${windowId}`;
		getToken()
			.then(token => {
				_token = token;
				//RECUPERO TRADUZIONI
				//todo use translation cache
				if (!i18n.hasLoadedNamespace(_i18nResourceBundle)) {
					return axios.get(
						`${process.env.REACT_APP_BACKEND_HOST}/locales/${i18n.language}/${windowId}`,
						{
							timeout: 5000,
							headers: {
								Authorization: _token,
								application: application,
								tenant: tenant,
							},
						}
					);
				}

				return Promise.resolve();
			})
			.then((resp) => {
				//CARICO LE TRADUZIONI RECUPERATE NEL BUNDLE DELLA FINESTRA
				if (resp?.data) {
					return i18n.addResourceBundle(
						i18n.language,
						_i18nResourceBundle,
						resp.data,
						true,
						true);
				}
				return Promise.resolve();
			})
			.then(() => {
				return axios.get(
					`${process.env.REACT_APP_BACKEND_HOST}/window?window=${windowId}`,
					{
						timeout: 60000,
						headers: {
							Authorization: _token,
							application: application,
							tenant: tenant,
						},
					}
				);
			})
			.then((res) => {
				//windowScript.innerHTML = res.data;
				//let windowData = document.getWindowData(navigate);
				if (typeof res.data === 'string' || res.data instanceof String) {
					throw `Window '${windowId}' returns data that is not a JSON Object. Check the syntax for the window definition.`;
				}

				setWindowMetadata(res.data);
				setLoadError(false);
				setIsLoading(false);
			})
			.catch((e) => {
				console.error(e);
				setLoadError(e);
				setIsLoading(false);
			});
	};

	return <div className={classNames("layout-main-container flex flex-column justify-content-between mt-4 pt-8 pb-2 px-4", windowMetadata?.padding)} style={{ minHeight: "calc(100vh - 4rem)" }}>
		{isLoading &&
			<div className="layout-main flex flex-1">
				<div className="flex flex-1 align-content-center flex-wrap card-container blue-container">
					<ProgressSpinner strokeWidth={4} />
				</div>
			</div>
		}
		{loadError &&
			<div className="card">
				<div className="grid">
					<div className="col-12">
						<ErrorPage
							code="Ops..."
							title="Window load error"
							message={loadError}
						/>
					</div>
				</div>
			</div>
		}
		{!isLoading && !loadError && windowMetadata &&
			<MemoComponent {...windowMetadata} />
		}
	</div>
}

export default Window;
