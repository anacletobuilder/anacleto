import React,{ useState } from 'react';
import { ToggleButton as PrimeToggleButton} from 'primereact/togglebutton';

function ToggleButton(props) {

    const [checked,setChecked] = useState(props.control.checked);

    const onChange = (_event) => {        
        if (props.control.events?.onChange) {
            props.control.events.onChange(_event,props.context)
        }
        setChecked(_event.value);
    }

    props.control.setChecked = (value) => {setChecked(value)};

    return <PrimeToggleButton
        id = {props.control.id}
        onIcon = {props.control.onIcon}
        offIcon = {props.control.offIcon}
        onLabel = {props.control.onLabel}
        offLabel = {props.control.offLabel}
        style = {props.control.style}
        className = {props.control.className}
        checked = {checked}
        tabIndex = {props.control.tabIndex}
        iconPos = {props.control.iconPos}
        tooltip = {props.control.tooltip}
        tooltipOption = {props.control.tooltipOption}
        onChange = {onChange}
    />
}

export default ToggleButton;