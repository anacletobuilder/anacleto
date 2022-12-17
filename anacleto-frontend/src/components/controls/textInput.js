import React, { useState, useEffect, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import PropTypes from "prop-types";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { defaultMemoizeFunction } from "../../utils/utils";

/**
 * Controllo di tipo testo
 *  config : {
 *      id: ID DELLA CONTROLLO
 *      disabled: true/false INDICA SE IL CONTROLLO VIENE ABILITATO
 *      value: indica il valore di default
 *      keyfilter: filtro per restringere i caratteri permessi in inserimento
 *      placeholder: testo da inserire se il valore del campo è nullo
 *      className: proprietà style del controllo
 *      onChange: evento da eseguire al cambio del valore
 *      onBlur: evento da eseguire alla perdita del fuoco dal campo
 * }
 *
 * @param {Object} props: properties
 * @param {Object} props.context: struttura della finestra
 * @returns
 */
function TextInput({ id, context, panelContext, ...props }) {
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);
	const [inputValue, setInputValue] = useState(props.value || (typeof props.record[id] == 'object' ? JSON.stringify(props.record[id]) : props.record[id]) || "");
	const [isValidInput, setIsValidInput] = useState(false);
	const [disabled, setDisabled] = useState((props.disabled === true || props.disabled === false ? props.disabled : (typeof props.record[id] == 'object')));

	//Mi tocca metterlo come stato perchè è aggiornato da un'evento asincrono e React non si accorge che cambia qualcosa lì
	const [icon, setIcon] = useState({ icon: props.icon, iconColor: props.iconColor, iconPosition: props.iconPosition });
	const [changeTimeout, setChangeTimeout] = useState(null);

	useEffect(() => {
		if(typeof props.disabled !== typeof undefined){
			setDisabled(props.disabled);
		}
	}, [props.disabled]);

	useEffect(() => {
		setInputValue(typeof props.record[id] == 'object' ? JSON.stringify(props.record[id]) : props.record[id] || "");
		if(typeof props.record[id] == 'object'){
			setDisabled(true);
		}
	}, [props.record/*, props.value*/]);

	useEffect(() => {
		updatePanelContext({ id, setDisabled });
	}, []);

	if(panelContext._status !== PANEL_STATUS_READY) return;

	if (!props.events) {
		props.events = {};
	}

	const onChange = async function(_event){
		const newValue = _event.target.value;
		
		//Update state value -> Controlled input
		setInputValue(newValue);
		
		//Update record value -> Value reflected on parent Form
		if(props.setRecord){
			props.setRecord({ ...props.record, [id]: newValue });
		}

		//Call onChange if passed by parent Component
		if(props.onChange){
			props.onChange(newValue);
		}

		//Call onChange if specified on events
		if (props.events.onChange) {
			props.events.onChange(_event, props.context,);
		}

		if (props.events.validate) {
			setIcon((prev) => ({ ...prev, icon: "pi pi-spin pi-spinner" }));
			setIcon((prev) => ({ ...prev, iconColor: "initial" }));

			clearTimeout(changeTimeout);
			setChangeTimeout(
				setTimeout(() => {
					const validationRes = props.events.validate.bind({ panel: props, context, components:panelsContext, updatePanelContext, ...panelContext })(_event) || { success: false };
					//È una promise
					if(validationRes.then instanceof Function){
						validationRes
						.then(() => {
							setIcon((prev) => ({ ...prev, icon: "pi pi-check-circle" }));
							setIcon((prev) => ({ ...prev, iconColor: "#68C044" }));
							
							setIsValidInput(true);
							panelContext.setInvalidMessage("");
						})
						.catch((e) => {
							setIcon((prev) => ({ ...prev, icon: "pi pi-times" }));
							setIcon((prev) => ({ ...prev, iconColor: "#ED4042" }));
							setIsValidInput(false);
							panelContext.setInvalidMessage(e.toString() || "");
						});
					}else{
						if (validationRes.success) {
							setIcon((prev) => ({ ...prev, icon: "pi pi-check-circle" }));
							setIcon((prev) => ({ ...prev, iconColor: "#68C044" }));
							
							setIsValidInput(true);
							panelContext.setInvalidMessage("");
						} else {
							setIcon((prev) => ({ ...prev, icon: "pi pi-times" }));
							setIcon((prev) => ({ ...prev, iconColor: "#ED4042" }));
							setIsValidInput(false);
							panelContext.setInvalidMessage(validationRes.message || "");
						}
					}
				}, 1000)
			);
		} else {
			setIsValidInput(true);
			panelContext.setInvalidMessage("");
		}
	};

	const onBlur = function (_event) {
		const newValue = _event.target.value;
		//props.onChange(newValue); //imposta il valore nella context

		//chiama l'eventuale evento custom definita dall'utente
		if (props.onBlur) {
			props.onBlur(_event, props.context, newValue);
		} else if (props.events.onBlur) {
			props.events.onBlur(_event, props.context, newValue);
		}
	};

	//Depending on hasFloatingLabel, the label element must be placed BEFORE or AFTER the <InputText> (-_-)
	const labelEl = <label htmlFor={id} className={classNames("pl-2 w-full", props.labelClassName)}>{props.label}</label>;

	return (
		<React.Fragment>
			<div
				className={classNames("anacleto-input-text-container mt-3 p-fluid field col",
					props.containerClassName,
					icon.iconPosition == "left" ? "p-input-icon-left" : "p-input-icon-right", "block",
					{ "p-float-label": props.hasFloatingLabel}
				)}
			>
				{!props.hasFloatingLabel && labelEl}
				<i className={icon.icon} style={{ color: icon.iconColor || "inital" }} />
				
				<InputText
					id={id}
					disabled={disabled}
					value={inputValue}
					keyfilter={props.keyfilter}
					placeholder={props.placeholder}
					className={classNames(
						"p-2 w-full",
						props.className,
						!isValidInput && props.invalidMessage
							? "p-invalid block"
							: ""
					)}
					onChange={(e) => onChange(e)}
					onBlur={(e) => onBlur(e)}
				/>
				{props.hasFloatingLabel && labelEl}
			</div>
			<small id={`${id}-error-msg`} className="p-error block absolute">
				{props.invalidMessage}
			</small>
		</React.Fragment>
	);
}

const MemoTextInput = React.memo(TextInput, (prev, next) => {
	return defaultMemoizeFunction(TextInput.propTypes, prev, next);
});
MemoTextInput.displayName = "TextInput";

TextInput.propTypes = {
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
	labelClassName: PropTypes.string,
	events: PropTypes.object,
	label: PropTypes.string,
	panelBaseMethods: PropTypes.object,
	hasFloatingLabel: PropTypes.bool,
	disabled: PropTypes.bool,
	icon: PropTypes.string,
	iconColor: PropTypes.string,
	iconPosition: PropTypes.string,
	invalidMessage: PropTypes.string,
	keyfilter: PropTypes.string,
	label: PropTypes.string,
	onBlur: PropTypes.func,
	onChange: PropTypes.func,
	placeholder: PropTypes.bool,
	value: PropTypes.string
}

export default MemoTextInput;