import React, { useState, useEffect } from "react";
import getClassNames from './utilityControls';
import { Divider as PrimeDivider } from 'primereact/divider';

function Divider(props) {
    const config = props.control;
    return <PrimeDivider
        align = {config.align ? config.align :  "center"}
        layout = {config.layout ? config.layout : null}
        type = {config.style ? config.style : null}
    ></PrimeDivider>;
}

export default Divider;