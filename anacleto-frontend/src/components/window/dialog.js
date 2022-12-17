import { Dialog as PrimeDialog } from "primereact/dialog";
import Utils, { defaultMemoizeFunction } from "../../utils/utils";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import { classNames } from "primereact/utils";
import "./dialog.css";
import { getToken } from "../../login/loginUtils";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import PropTypes from "prop-types";
import MemoComponent from "../component";
import MemoButton from "../controls/button";
import {getFunctionFromMetadata} from "../../utils/utils";

const Dialog = ({ id, context, forwardData, ...props }) => {
	const { panelsContext, updatePanelContext, resetPanelContext } = useContext(PanelsContext);
	const [panelContext, setPanelContext] = useState({});
	const [dialogMetadata, setDialogMetadata] = useState(null);
	const navigate = useNavigate();
	const dialogScript = document.createElement("script");

	const onHide = () => {
		props.setDialogSettings((prev) => ({...prev, visible: false}));
	};
	useEffect(() => {
		updatePanelContext({
			id,
			_status: PANEL_STATUS_READY,
			closeWindow: onHide,
			forwardData
		});
	}, []);

	useEffect(() => {
		debugger
		updatePanelContext({
			id,
			forwardData
		});
	}, [forwardData]);

	useEffect(() => {
		if(!panelsContext || typeof panelsContext[id] === typeof undefined) return;
		if(panelContext !== panelsContext[id]){
			setPanelContext(panelsContext[id]);
		}
	}, [panelsContext]);

	useEffect(() => {
		if(props.settings.visible){
			fetchData(props.settings.windowId);
		}
	}, [
		props.settings.visible,
		context.tenant,
		context.application,
		context.destApplication,
		props.settings.windowId,
	]);

	const fetchData = (windowId) => {
		if (windowId) {
			getToken().then(token => {
				return axios.get(
					`${process.env.REACT_APP_BACKEND_HOST}/window?window=${windowId}&application=${context.application}&destapplication=${context.destApplication}`,
					{
						timeout: 60000,
						headers: {
							Authorization: token,
							application: context.application,
							tenant: context.tenant,
						},
					}
				)
			}).then((res) => {
				setDialogMetadata(res.data);
			})
			.catch((e) => {
				console.error(e);
			});
		} else {
			setDialogMetadata(null);
		}
	};

	let footer = <React.Fragment />;
	if(props.settings.actions){
		var btns = [];
		props.settings.actions.map((atn) => {
			const onClick = function (_event) {
				if (atn.events?.onClick){
					//Convert and execute the function
					getFunctionFromMetadata(atn.events.onClick).bind({ panel: props, context, components:panelsContext, updatePanelContext, ...panelContext })(_event);
				}
			};
			btns.push(
				<MemoButton
					id={atn.id}
					key={atn.id}
					icon={atn.icon}
					onClick={onClick}
					label={atn.label}
					containerClassName="flex-none"
					className={classNames(atn.className)}
					context={context}
					panelContext = {{ /* Nothing to initialize here */ _status: PANEL_STATUS_READY }}
				/>
			)
		});

		footer = <div className="flex flex-row-reverse border-top-1 surface-border pt-3">
			{btns}
		</div>
	}
	return (
		<PrimeDialog
			id={id}
			header={props.settings.header}
			footer={props.settings.footer || footer}
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
			closeOnEscape={props.settings.closeOnEscape || true}
			dismissableMask={props.settings.dismissableMask || true}
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
					<MemoComponent {...dialogMetadata} forwardData={forwardData} />
				</div>
			) : (
				//caricamento in corso
				<div className="layout-main h-full flex"></div>
			)}
		</PrimeDialog>
	);
}
const MemoDialog = React.memo(Dialog, (prev, next) => {
	return defaultMemoizeFunction(Dialog.propTypes, prev, next);
});
MemoDialog.displayName = "Dialog";

Dialog.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	className: PropTypes.string,
	setDialogSettings: PropTypes.func,
	settings: PropTypes.object.isRequired,
	userCredential: PropTypes.object,
	windowId: PropTypes.any,
};

export default MemoDialog;