import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Slider as PrimeSlider } from 'primereact/slider';
import { defaultMemoizeFunction } from "../../utils/utils";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { classNames } from "primereact/utils";
const { v4: uuidv4 } = require("uuid");

const Slider = ({ id, context, panelContext, windowData, ...props }) => {
	const application = context.application;
	const destApplication = context.destApplication;
	const tenant = context.tenant;
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);
	const [value, setValue] = useState(props.value);

	const onChange = (event) => {
		if (props.onChange) {
			props.onChange.bind({ panel: props, context, windowData, components: panelsContext, updatePanelContext, ...panelContext })(event.value);
		}

		setValue(event.value);
	}

	useEffect(() => {
		if (props.value != null) {
			setValue(props.value);
		}
	}, [props.value]);

	useEffect(() => {
		updatePanelContext({
			id,
			setValue
		});
	}, []);

	if (panelContext._status !== PANEL_STATUS_READY) return;

	return (
		<PrimeSlider
			className={classNames("anacleto-slider", (props.className || ""))}
			value={value}
			animate={props.animate}
			min={props.min}
			max={props.max}
			orientation={props.orientation}
			step={props.step}
			range={props.range}
			disabled={props.disabled}
			onChange={onChange}
		/>
	);
}

Slider.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	updatePanelContext: PropTypes.func,
	className: PropTypes.string,
	events: PropTypes.object,
	setIsLoading: PropTypes.func,
	isCard: PropTypes.bool,
	value: PropTypes.any,
	animate: PropTypes.bool,
	min: PropTypes.number,
	max: PropTypes.number,
	orientation: PropTypes.string,
	step: PropTypes.number,
	range: PropTypes.bool,
	disabled: PropTypes.bool,
	onChange: PropTypes.func,
};

const MemoSlider = React.memo(Slider, (prev, next) => {
	return defaultMemoizeFunction(Slider.propTypes, prev, next);
});
MemoSlider.displayName = "Slider";

export default MemoSlider;