import React, { useState } from 'react';
import { Chips as PrimeChips } from 'primereact/chips';
import { getClassNames } from './utilityControls';


function Chips(props) {

    const config = props.control;
    const [values, setValue] = useState(config.values);
    const defaultFunction = (e) => {};
    const onChange = config.onChange ? config.onChange : defaultFunction;

    return <PrimeChips 
        value={values} 
        className={getClassNames(config)}
        onChange={(e) => {setValue(e.value); onChange(e);}} 
        placeholder={config.placeholder}
        max={config.max}
        disabled={config.disabled}
        readOnly={config.readOnly}
        removable={config.removable}
        tooltip={config.tooltip}
        tooltipOptions={config.tooltipOptions}
        ariaLabelledBy={config.ariaLabelledBy}
        allowDuplicate={config.allowDuplicate}
        separator={config.separator}
        itemTemplate={config.itemTemplate}
    />
}

export default Chips;