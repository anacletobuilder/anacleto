import React from 'react';
import { Badge  as PrimeBadge} from 'primereact/badge';
import { getClassNames } from './utilityControls';

const Badge = (props) => {
    const config = props.control;
    return <PrimeBadge
        className={getClassNames(config)}
        value={config.value}
        severity={config.severity}
        size={config.size}
    ></PrimeBadge>
}

export default Badge;