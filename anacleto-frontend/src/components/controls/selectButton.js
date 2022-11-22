import React, { useState } from 'react';
import { SelectButton as PrimeSelectButton } from 'primereact/selectbutton';
import { classNames } from "primereact/utils";


const SelectButton = (props) => {
    
    //const config = props.getConfigById(props.id)
    const config = props;

    const [value, setValue] = useState(config.value);
    return <PrimeSelectButton 
                value={value} 
                className={classNames("w-full", config.fieldClassName)}
                options={config.options}
                multiple={config.multiple}
                disabled={config.disabled}
                onChange={(e) => setValue(e.value)} 
            />
}

export default SelectButton;