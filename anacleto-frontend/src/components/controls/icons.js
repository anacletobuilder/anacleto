import React, { useState, useEffect } from "react";
import 'primeicons/primeicons.css';
import { classNames } from "primereact/utils";

function Icon(props) {
    const config = props.control;

    if(config.fontSize) {
        return <i className={classNames(config.className)} style={{fontSize: config.fontSize}}></i>;
    }else {
        return <i className={classNames(config.className)}></i>;
    }
}


export default Icon;