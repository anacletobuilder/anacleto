import React, { useContext, useEffect, useState } from "react";
import { classNames } from "primereact/utils";
import { Avatar as PrimeAvatar } from "primereact/avatar";
import PropTypes from 'prop-types';
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { defaultMemoizeFunction } from "../../utils/utils";

const Avatar = ({ id, context, panelContext, windowData, ...props }) => {
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);
	const [label, setLabel] = useState(props.label);
	const [icon, setIcon] = useState(props.icon);
	const [image, setImage] = useState(props.image);

	useEffect(() => {
		if(props.events.onRecordChange){
			props.events.onRecordChange.bind({ panel: props, context, PanelsContext, updatePanelContext, ...panelContext })(props.record);
		}
	}, [props.record]);

	useEffect(() => {
		updatePanelContext({
			id,
			setLabel,
			setIcon,
			setImage
		});
	}, []);

	useEffect(() => {
		setImage(typeof props.record[id] == 'object' ? JSON.stringify(props.record[id]) : props.record[id] || props.image);
	}, [props.record]);

	if(panelContext._status !== PANEL_STATUS_READY) return;
	
	let additionalProps = {};
	if(label){
		additionalProps.label = (label || "").toUpperCase();
	}
	if(!additionalProps.label){
		if(image){
			additionalProps.image = image;
		}else{
			additionalProps.icon = icon || "pi pi-user"
		}
	}
	return (
		<div className={classNames("anacleto-avatar-container", props.containerClassName)}>
			<PrimeAvatar
				className={classNames("", props.className)}
				shape={props.shape || "circle"}
				size={props.size || "normal"}
				style={{ fontSize: "1.5rem" }}
				{ ...additionalProps }
			/>
		</div>
	);
};
const MemoAvatar = React.memo(Avatar, (prev, next) => {
	return defaultMemoizeFunction(Avatar.propTypes, prev, next);
});
MemoAvatar.displayName = "Avatar";

Avatar.propTypes = {
	id: PropTypes.string.isRequired,
	updatePanelContext: PropTypes.func,
	windowData: PropTypes.any,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	panelContext: PropTypes.object.isRequired,
	setIsLoading: PropTypes.func,
	context: PropTypes.object.isRequired,
	className: PropTypes.string,
	containerClassName: PropTypes.string,
	shape: PropTypes.oneOf(["square", "circle"]),
	size: PropTypes.oneOf(["large", "xlarge"]),
	label: PropTypes.string,
	icon: PropTypes.string,
	image: PropTypes.string,
	events: PropTypes.object,
};
export default Avatar;