import React from 'react';
import { Tag as PrimeTag} from 'primereact/tag';
import getClassNames from './utilityControls';
import { classNames } from 'primereact/utils';
const Tag = (props) => {
    const config = props.control;

    return <PrimeTag
        className={classNames(config.className)}
        severity = {config.severity}
        rounded = {config.rounded}
        icon = {config.icon}
    >{config.label}</PrimeTag>;
}

export default Tag;