import i18next from 'i18next';
import { classNames } from "primereact/utils";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { defaultMemoizeFunction } from "../../utils/utils";
import { useSelector } from "react-redux";
import { selectApplication, selectWindow } from "../../reducers/context";
import { getTranslator } from '../../utils/translator';

const Label = ({ id, context, panelContext, windowData, ...props }) => {
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);
	const [label, setLabel] = useState(props.record && (typeof props.record[id] == 'object' ? JSON.stringify(props.record[id]) : props.record[id]) || props.label);
	const application = useSelector(selectApplication);
	const window = useSelector(selectWindow);

	const t = getTranslator({ application , window});

	useEffect(() => {
		updatePanelContext({ id });
	}, []);

	useEffect(() => {
		setLabel(props.label);
	}, [props.label]);

	useEffect(() => {
		if (!props.record) return;

		setLabel((typeof props.record[id] == 'object' ? JSON.stringify(props.record[id]) : props.record[id]) || props.label);
	}, [props.record]);

	if (panelContext._status !== PANEL_STATUS_READY) return;

	//if(id == "displayName") debugger;

	
	return (
		<label
			className={classNames("anacleto-label", props.className)}
			htmlFor={props.for}
		>
			{props.children}
			{t(id,label)}
		</label>
	)
}
const MemoLabel = React.memo(Label, (prev, next) => {
	return defaultMemoizeFunction(Label.propTypes, prev, next);
});
MemoLabel.displayName = "Label";

Label.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	updatePanelContext: PropTypes.func,
	windowData: PropTypes.any,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	setIsLoading: PropTypes.func,
	className: PropTypes.string,
	isCard: PropTypes.bool,
	title: PropTypes.string,
	panelBaseMethods: PropTypes.object,
	label: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	for: PropTypes.string,
}
export default MemoLabel;