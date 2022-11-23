import React, { useState, useEffect, useContext } from "react";
import { AutoComplete as PrimeAutoComplete } from "primereact/autocomplete";
import PropTypes from "prop-types";
import { defaultMemoizeFunction } from "../../utils/utils";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { classNames } from "primereact/utils";
/**
 *
 * @param {Object} props: properties
 * @param {Object} props.context: struttura della finestra
 * @returns
 */
function AutoComplete({ id, context, panelContext, ...props }) {
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);

	const [availableValues, setAvailableValues] = useState([]); //Valori disponibili
	const [filteredList, setFilteredList] = useState(null); //Valori filtrati
	const [selectedValue, setSelectedValue] = useState(null);

	useEffect(() => {
		updatePanelContext({ id });
	}, []);

	useEffect(() => {
		setAvailableValues(
			props.record[props.availableValuesField] || props.availableValues
		);
	}, [props.record]);

	if(panelContext._status !== PANEL_STATUS_READY) return;

	/**
	 * Metodo con cui filtrare l'autocompletamento
	 * @param {Object} event
	 */
	const completeMethod = (event) => {
		setTimeout(() => {
			let _filteredValue;
			if (!event.query.trim().length) {
				_filteredValue = [...availableValues];
			} else {
				_filteredValue = availableValues.filter((_value) => {
					return (
						_value[props.filterField]
							.toLowerCase()
							.indexOf(event.query.toLowerCase()) > -1
					);
				});
			}

			setFilteredList(_filteredValue);
		}, 250);
	};

	const onChange = function (_event) {
		setSelectedValue(_event.value);
		
		if(props.setRecord){
			props.setRecord({ [id]: _event.value });
		}
	};

	const labelEl = <label htmlFor={id} className={classNames("pl-2 w-full", props.labelClassName)}>{props.label}</label>;
	return (<React.Fragment>
			<span className={classNames("anacleto-autocomplete-container mt-3 p-fluid", props.containerClassName, {
				"p-float-label": props.hasFloatingLabel,
				"p-input-icon-left": props.iconPosition === "left",
				"p-input-icon-right": props.iconPosition === "right",
			})}>

				{!props.hasFloatingLabel && labelEl}
				{props.icon && <i className={props.icon} />}
				<PrimeAutoComplete
					dropdown
					value={selectedValue || props.record[id]}
					suggestions={filteredList}
					completeMethod={(e) => completeMethod(e)}
					field={props.descriptionField}
					className={classNames("anacleto-autocomplete", props.className)}
					multiple
					onChange={(e) => onChange(e)}
					aria-label={props.label}
				/>
				{props.hasFloatingLabel && labelEl}

			</span>
		</React.Fragment>
	);
}
const MemoAutoComplete = React.memo(AutoComplete, (prev, next) => {
	return defaultMemoizeFunction(AutoComplete.propTypes, prev, next);
});

MemoAutoComplete.displayName = "AutoComplete";
AutoComplete.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	updatePanelContext: PropTypes.func,
	forwardData: PropTypes.any,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	setIsLoading: PropTypes.func,
	containerClassName: PropTypes.string,
	className: PropTypes.string,
	filterField: PropTypes.string.isRequired,
	label: PropTypes.string,
	descriptionField: PropTypes.string,
	availableValuesField: PropTypes.string,
	availableValues: PropTypes.string,
	panelBaseMethods: PropTypes.object,
	hasFloatingLabel: PropTypes.bool,
	disabled: PropTypes.bool,
	style: PropTypes.object,
	events: PropTypes.object,
}

export default AutoComplete;