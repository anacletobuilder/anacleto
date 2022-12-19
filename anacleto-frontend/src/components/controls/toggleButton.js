import React,{ useContext, useEffect, useState } from 'react';
import { ToggleButton as PrimeToggleButton} from 'primereact/togglebutton';
import { PanelsContext, PANEL_STATUS_READY } from '../../contexts/panelsContext';
import { defaultMemoizeFunction } from '../../utils/utils';
import PropTypes from 'prop-types';

const ToggleButton = ({ id, context, panelContext, windowData, ...props }) => {
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

    const onChange = (_event) => {
        if (props.events?.onChange) {
            props.events.onChange.bind({ panel: props, context, windowData, components:panelsContext, updatePanelContext, ...panelContext })(_event);
        }
        setChecked(_event.value);
    }

    return <PrimeToggleButton
        id = {id}
        onIcon = {props.onIcon}
        offIcon = {props.offIcon}
        onLabel = {props.onLabel}
        offLabel = {props.offLabel}
        style = {props.style}
        className = {props.className}
        checked = {checked}
        tabIndex = {props.tabIndex}
        iconPos = {props.iconPos}
        tooltip = {props.tooltip}
        tooltipOption = {props.tooltipOption}
        onChange = {onChange}
    />
}

const MemoToggleButton = React.memo(ToggleButton, (prev, next) => {
	return defaultMemoizeFunction(ToggleButton.propTypes, prev, next);
});
MemoToggleButton.displayName = "ToggleButton";

ToggleButton.propTypes = {
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
	events: PropTypes.object,
	iconPos: PropTypes.string,
	offIcon: PropTypes.string,
	offLabel: PropTypes.string,
	onIcon: PropTypes.string,
	onLabel: PropTypes.string,
	tabIndex: PropTypes.any,
	tooltip: PropTypes.string,
	tooltipOption: PropTypes.any,
}
export default MemoToggleButton;