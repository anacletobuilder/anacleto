import { Checkbox as PrimeCheckbox } from "primereact/checkbox";
import React, { useContext, useEffect, useState } from "react";
import { classNames } from "primereact/utils";
import PropTypes from "prop-types";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { defaultMemoizeFunction } from "../../utils/utils";

const Checkbox = ({ id, context, panelContext, windowData, ...props }) => {
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);
	const [checked, setChecked] = useState(props.value === true || props.value === false ? props.value : props.record[id] || false);
	
	useEffect(() => {
		updatePanelContext({
			id,
			setChecked
		});
	}, []);

	useEffect(() => {
		setChecked(props.value === true || props.value === false ? props.value : props.record[id] || false);
	}, [props.value]);

	if(panelContext._status !== PANEL_STATUS_READY) return;

	const onChange = function (_event) {
		const newValue = _event.target.checked;
		if(props.setRecord){
			props.setRecord({ [id]: newValue });
		}

		//chiama l'eventuale eventuale custom definita dall'utente
		if (props.onChange) {
			props.onChange.bind({ panel: props, context, windowData, components:panelsContext, updatePanelContext, ...panelContext })(_event, newValue);
		}
	};
	const onBlur = props.onBlur ? props.onBlur : () => {};

	return (
		<div className={classNames("field-checkbox px-2", props.containerClassName, props.className)}>
			<PrimeCheckbox
				inputId={id}
				checked={checked}
				disabled={props.disabled}
				onChange={(e) => onChange(e)}
				onBlur={(e) => onBlur(e)}
			/>
			{props.label && <label htmlFor={id}>{props.label}</label>}
		</div>
	);
}

const MemoCheckbox = React.memo(Checkbox, (prev, next) => {
	return defaultMemoizeFunction(Checkbox.propTypes, prev, next);
});
MemoCheckbox.displayName = "Checkbox";

Checkbox.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	updatePanelContext: PropTypes.func,
	windowData: PropTypes.any,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	setIsLoading: PropTypes.func,
	containerClassName: PropTypes.string,
	className: PropTypes.string,
	panelBaseMethods: PropTypes.object,
	value: PropTypes.bool,
	disabled: PropTypes.bool,
	style: PropTypes.object,
	label: PropTypes.string,
	onChange: PropTypes.func,
}
export default MemoCheckbox;