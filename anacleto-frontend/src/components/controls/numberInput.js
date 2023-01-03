import React, { useState, useEffect } from "react";
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from "primereact/utils";

const NumberInput = (props) => {
    const config = props.control;
    const [value,setValue] = useState(config.value);
    const [icon, setIcon] = useState({ icon: config.icon, iconColor: config.iconColor, iconPosition: config.iconPosition });

	if (!config.events) {
		config.events = {};
	}
    useEffect(() => {return () => {};}, [props.record]);

    const [changeTimeout, setChangeTimeout] = useState(null);

    const onChange = async function(_event){
		const newValue = _event.target.value;
		props.onChange(newValue); //imposta il valore nella context

		//chiama l'eventuale evento custom definita dall'utente
		if (config.events.onChange) {
			config.events.onChange(_event, props.context,);
		}

		if (config.events.validate) {
			setIcon((prev) => ({ ...prev, icon: "pi pi-spin pi-spinner" }));
			setIcon((prev) => ({ ...prev, iconColor: "initial" }));

			clearTimeout(changeTimeout);
			setChangeTimeout(
				setTimeout(() => {
					const validationRes = config.events.validate(_event, props.context) || { success: false };
					//È una promise
					if(validationRes.then instanceof Function){
						validationRes
						.then(() => {
							setIcon((prev) => ({ ...prev, icon: "pi pi-check-circle" }));
							setIcon((prev) => ({ ...prev, iconColor: "#68C044" }));
							
							props.setIsValidInput(true);
							props.setInvalidMessage("");
						})
						.catch((e) => {
							setIcon((prev) => ({ ...prev, icon: "pi pi-times" }));
							setIcon((prev) => ({ ...prev, iconColor: "#ED4042" }));
							props.setIsValidInput(false);
							props.setInvalidMessage(e.toString() || "");
						});
					}else{
						if (validationRes.success) {
							setIcon((prev) => ({ ...prev, icon: "pi pi-check-circle" }));
							setIcon((prev) => ({ ...prev, iconColor: "#68C044" }));
							
							props.setIsValidInput(true);
							props.setInvalidMessage("");
						} else {
							setIcon((prev) => ({ ...prev, icon: "pi pi-times" }));
							setIcon((prev) => ({ ...prev, iconColor: "#ED4042" }));
							props.setIsValidInput(false);
							props.setInvalidMessage(validationRes.message || "");
						}
					}
				}, 1000)
			);
		} else {
			props.setIsValidInput(true);
			props.setInvalidMessage("");
		}
	};

    const onBlur = function (_event) {
		const newValue = _event.target.value;
		//props.onChange(newValue); //imposta il valore nella context

		//chiama l'eventuale evento custom definita dall'utente
		if (config.onBlur) {
			config.onBlur(_event, props.context, newValue);
		} else if (config.events.onBlur) {
			config.events.onBlur(_event, props.context, newValue);
		}
	};

    let Component = <InputNumber 
        inputId={config.id} 
        value={props.record[config.id]}
        className={classNames("w-full", config.fieldClassName)}
        mode={config.mode}
        useGrouping={config.useGrouping}
        minFractionDigits={config.minFractionDigits} 
        maxFractionDigits={config.maxFractionDigits}
        min={config.min}
        max={config.max}
        locale={config.locale}
        currency={config.currency}
        currencyDisplay={config.currencyDisplay}
        prefix={config.prefix}
        suffix={config.suffix}
        showButtons={config.showButtons}
        buttonLayout={config.buttonLayout}
        steps={config.steps}
        decrementButtonClassName = {config.decrementButtonClassName}
        incrementButtonClassName = {config.incrementButtonClassName}
        incrementButtonIcon = {config.incrementButtonIcon}
        decrementButtonIcon = {config.decrementButtonIcon}
        onValueChange={(e) => onChange(e)}
		onBlur={(e) => onBlur(e)}
    />
    
    return <React.Fragment>
			<span
				className={classNames("p-fluid p-float-label", icon.iconPosition == "left" ? "p-input-icon-left" : "p-input-icon-right", "block")}
			>
				<i className={icon.icon} style={{ color: icon.iconColor || "inital" }} />
				{ Component }
				<label
					htmlFor={config.id}
					className={classNames("w-full", config.labelClassName)}
				>
					{config.label}
				</label>
			</span>
			<small id={`${config.id}-error-msg`} className="p-error block absolute">
				{props.invalidMessage}
			</small>
		</React.Fragment>
}

export default NumberInput;