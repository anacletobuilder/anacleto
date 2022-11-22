import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from "primereact/utils";


function TextareaInput(props) {
    const defaultFunction = (e) => {};
    const config = props.control;

    const onChange = function (_event) {
        const newValue = _event.target.value;
        props.onChange(newValue); //imposta il valore nella context

        //chiama l'eventuale evento custom definita dall'utente
        if (config.onChange) {
            config.onChange(_event, props.context, newValue)
        }
    }
    const onBlur = config.onBlur ? config.onBlur : defaultFunction;

    return <InputTextarea 
            value={props.record[config.id] || ''}
                className={classNames("w-full", config.fieldClassName)} 
                rows={config.rows} 
                cols={config.cols} 
                autoResize = {config.autoResize}
                onChange={(e) => onChange(e)}
                onBlur={(e) => onBlur(e)} 
            />;
}


export default TextareaInput;