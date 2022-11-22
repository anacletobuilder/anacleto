import {Dropdown as PrimeDropdown } from 'primereact/dropdown';
import React, { useState, useEffect, useRef } from 'react';
import getClassNames from "./utilityControls";
import { Skeleton } from 'primereact/skeleton';
import { classNames } from 'primereact/utils';

function Dropdown(props) {
    const config = props.control;
    console.log(config);
    const [items,setItems] = useState(config.options || []);
    const [selected, setSelected] = useState(props.record[config.id]);
    const [lazyLoading, setLazyLoading] = useState(false);

    useEffect(() => {
        
        onLazyLoad();
        
        return () => {};
    }, [props.record, config.options]);

    const onChange = (_event) => {
        console.log("onChange");
        setSelected(_event.value); 
        props.record[config.id] = _event.value;
        if(config.events?.onChange) {
            config.events.onChange(_event, props.contex);
        }
    };

    const onMouseDown = (_event) => {
        console.log("onMouseDown");
        if(config.events?.onMouseDown) {
            config.events.onMouseDown(_event,props.context);
        }
    }
    const onFocus = (_event) => {
        console.log("onFocus");
        if(config.events?.onFocus) {
            config.events.onFocus(_event,props.context);
        }
    }
    const onBlur = (_event) => {
        console.log("onBlur");
        if(config.events?.onBlur) {
            config.events.onBlur(_event,props.context);
        }
    }
    const onFilter = (_event) => {
        console.log("onFilter");
        if(config.events?.onFilter) {
            config.events.onFilter(_event,props.context);
        }
    }


    const onLazyLoad = (event) => {
        setLazyLoading(true);
        if (config.options) {
            let _items = [...config.options];
            setItems(_items);
        }else {
            //TODO: gestione chiamata asincrona o recupero option
            //setItems([]);
        }
        setLazyLoading(false);
    }

    const virtualScrollerOptions = {
        lazy: true,
        onLazyLoad: onLazyLoad,
        itemSize: config.rowHeight ? config.rowHeight: 45, 
        delay: 250,

    }

    return <PrimeDropdown
        id = {config.id}
        name = {config.name}
        value={props.record[config.id]} 
        options={items} 
        optionLabel = {config.optionLabel}
        optionValue = {config.optionValue}
        optionDisabled = {config.optionDisabled}
        optionGroupLabel = {config.optionGroupLabel}
        optionGroupChildren = {config.optionGroupChildren}
        style = {config.style}
        className = {classNames("w-full", config.fieldClassName)}
        scrollHeight = {config.scrollHeight}
        filter = {config.filter}
        filterBy = {config.filter ? config.filterBy : null}
        filterMatchMode = {config.filterMatchMode}
        filterPlaceholder = {config.filterPlaceholder}
        filterLocale = {config.filterLocale}
        emptyMessage = {config.emptyMessage}
        emptyFilterMessage = {config.emptyFilterMessage}
        resetFilterOnHide = {config.resetFilterOnHide}
        editable = {config.editable}
        placeholder = {config.placeholder}
        required = {config.required}
        disabled = {config.disabled}
        appendTo = {config.appendTo}
        autoFocus = {config.autoFocus}
        filterInputAutoFocus = {config.filterInputAutoFocus}
        showFilterClear = {config.showFilterClear}
        panelClassName = {config.panelClassName}
        panelStyle = {config.panelStyle}
        dataKey = {config.dataKey}
        inputId = {config.inputId}
        showClear = {config.showClear}
        maxLength = {config.maxLength}
        ariaLabel = {config.ariaLabel}
        ariaLabelledBy = {config.ariaLabelledBy}
        transitionOptions = {config.transitionOptions}
        dropdownIcon = {config.dropdownIcon}
        showOnFocus = {config.showOnFocus}
        virtualScrollerOptions={virtualScrollerOptions}
        onChange={onChange}
        onMouseDown={onMouseDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onFilter={onFilter}
        
    />
}

Dropdown.whyDidYouRender = false;
export default Dropdown;