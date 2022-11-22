import { InputSwitch } from 'primereact/inputswitch';
import React, { useState } from 'react';
import { classNames } from "primereact/utils";


/*
control {
    checked: ,
    id:,
    disabled:
}
*/

function SwitchInput(props) {
    const defaultFunction = (e) => {};

    const config = props.control;
    const [checked, setChecked] = useState(config.checked);

    const onChange = config.onChange ? config.onChange : defaultFunction;
    const onFocus = config.onFocus ? config.onFocus : defaultFunction;
    const onBlur = config.onBlur ? config.onBlur : defaultFunction;

    return <InputSwitch 
        id={config.id} 
        checked={checked} 
        disabled={config.disabled}
        className={classNames("w-full", config.fieldClassName)}
        onChange={(e) => {setChecked(e.value);onChange(e)}}
        onFocus={(e) => onFocus(e)}
        onBlur={(e) => onBlur(e)}
    />
}

export default SwitchInput;