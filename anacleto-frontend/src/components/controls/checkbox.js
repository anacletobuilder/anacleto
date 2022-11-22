import { Checkbox as PrimeCheckbox } from "primereact/checkbox";
import React, { useContext, useEffect, useState } from "react";
import { classNames } from "primereact/utils";
import PropTypes from "prop-types";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { defaultMemoizeFunction } from "../../utils/utils";

const Checkbox = ({ id, context, panelContext, ...props }) => {
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);
	
	useEffect(() => {
		updatePanelContext({ id })
	}, []);
	
	if(panelContext._status !== PANEL_STATUS_READY) return;

	const onChange = function (_event) {
		const newValue = _event.target.checked;
		if(props.setRecord){
			props.setRecord({ [id]: newValue });
		}

		//chiama l'eventuale eventuale custom definita dall'utente
		if (props.onChange) {
			props.onChange.bind({ panel: props, context, panelsContext, updatePanelContext, ...panelContext })(_event, newValue);
		}
	};
	const onBlur = props.onBlur ? props.onBlur : () => {};

	return (
		<div className={classNames("field-checkbox", props.className)}>
			<PrimeCheckbox
				inputId={id}
				checked={props.record[id] || ""}
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
	updatePanelContext: PropTypes.func,
	setIsLoading: PropTypes.func,
	context: PropTypes.object.isRequired,
	className: PropTypes.string,
	panelBaseMethods: PropTypes.object,
	disabled: PropTypes.bool,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	style: PropTypes.object,
	label: PropTypes.string,
}
export default MemoCheckbox;