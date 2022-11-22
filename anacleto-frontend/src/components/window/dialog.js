import { Dialog as PrimeDialog } from "primereact/dialog";
import Utils from "../../utils/utils";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MemoGridContainer from "../panels/gridContainer";
import { ProgressSpinner } from "primereact/progressspinner";
import { classNames } from "primereact/utils";
import "./dialog.css";
import { getToken } from "../../login/loginUtils";

function Dialog(props) {
	const [dialogMetadata, setDialogMetadata] = useState(null);
	const navigate = useNavigate();

	/**
	 * metadati della finestra che arrivano dal server e servono a renderizzarla
	 */
	const [loadError, setLoadError] = useState(false);
	const dialogScript = document.createElement("script");

	useEffect(() => {
		document.body.appendChild(dialogScript);

		//li risetto altrimenti destapplication è sempre null anche se in creazione era stato passato
		//non ho ben capito il perchè ma va beh
		setContext(
			Object.assign(context, {
				tenant: props.tenant,
				application: props.metadata.application,
				destapplication: props.destApplication,
			})
		);

		fetchData(props.settings.windowId);

		return () => {
			console.log("Dialog component is unmounting");
			document.body.removeChild(dialogScript);
		};
	}, [
		props.tenant,
		props.application,
		props.destApplication,
		props.settings.windowId,
	]);

	const fetchData = (windowId) => {
		if (windowId) {

			getToken().then(token => {
				return axios.get(
					`${process.env.REACT_APP_BACKEND_HOST}/window?window=${windowId}&application=${props.application}&destapplication=${props.destApplication}`,
					{
						timeout: 60000,
						headers: {
							Authorization: token,
							application: props.metadata.application,
							tenant: props.tenant,
						},
					}
				)
			}).then((res) => {
				dialogScript.innerHTML = res.data;
				let windowData = document.getWindowData(navigate);

				/*LDN: Perchè solo per questa finestra?
				Mi dava errore nel nuovo cliente dicendo che gli eventi non
				erano di tipo function perchè erano rimasti stringhe
				*/
				//if (windowData.window == "window_detail") {
				windowData = window.utils._parseJsonWithFunctions(
					window.utils._stringifyJsonWithFunctions(windowData)
				);
				//}

				setDialogMetadata(windowData);
				setLoadError(false);
			})
				.catch((e) => {
					console.error(e);
					setLoadError(true);
				});

		} else {
			setDialogMetadata(null);
		}
	};

	const onHide = () => {
		props.setDialogSettings({
			visible: false,
			position: props.settings.position,
		});
	};

	const [context, setContext] = useState({
		tenant: props.tenant,
		application: props.metadata.application,
		destapplication: props.destApplication,
		windowId: props.windowId,
		panels: {}, //i pannelli si aggiungono man mano che vengono creati
		closeWindow: onHide,
		userCredential: props.userCredential,
	});

	return (
		<PrimeDialog
			id={props.id}
			header={props.settings.header}
			footer={props.settings.footer}
			visible={props.settings.visible || false}
			position={props.settings.position}
			modal={props.settings.modal}
			resizable={props.settings.resizable}
			draggable={props.settings.draggable}
			minX={props.settings.minX}
			minY={props.settings.minY}
			keepInViewport={props.settings.keepInViewport}
			headerStyle={props.settings.headerStyle}
			headerClassName={props.settings.headerClassName}
			contentStyle={props.settings.contentStyle}
			contentClassName={classNames(props.settings.contentClassName, "flex")}
			closeOnEscape={props.settings.closeOnEscape}
			dismissableMask={props.settings.dismissableMask}
			rtl={props.settings.rtl}
			closable={props.settings.closable}
			style={props.settings.style || { width: "75vw", minHeight: "75vh", maxHeight: "95vh" }}
			className={props.settings.className}
			maskStyle={props.settings.maskStyle}
			maskClassName={props.settings.maskClassName}
			showHeader={props.settings.showHeader}
			appendTo={props.settings.appendTo}
			baseZIndex={props.settings.baseZIndex}
			maximizable={props.settings.maximizable}
			blockScroll={props.settings.blockScroll}
			icons={props.settings.icons}
			ariaCloseIconLabel={props.settings.ariaCloseIconLabel}
			focusOnShow={props.settings.focusOnShow}
			maximized={props.settings.maximized}
			breakpoints={props.settings.breakpoints || { "960px": "75vw" }}
			transitionOptions={props.settings.transitionOptions}
			onHide={onHide}
		>
			{dialogMetadata ? (
				<div className="layout-main flex flex-1">
					<MemoGridContainer
						key={props.windowId + "_container"}
						items={
							dialogMetadata?.items ? dialogMetadata.items : null
						}
						layout={dialogMetadata.layout}
						className={dialogMetadata.className}
						context={context || {}}
					></MemoGridContainer>
				</div>
			) : (
				//caricamento in corso
				<div className="layout-main h-full flex"></div>
			)}
		</PrimeDialog>
	);
}

export default Dialog;
