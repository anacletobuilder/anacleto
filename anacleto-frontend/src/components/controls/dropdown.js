import { Dropdown as PrimeDropdown } from 'primereact/dropdown';
import React, { useState, useEffect, useRef, useContext } from 'react';
import getClassNames from "./utilityControls";
import { Skeleton } from 'primereact/skeleton';
import { classNames } from 'primereact/utils';
import { PanelsContext, PANEL_STATUS_READY } from '../../contexts/panelsContext';
import { defaultMemoizeFunction } from '../../utils/utils';
import PropTypes from 'prop-types';

const Dropdown = ({ id, context, panelContext, windowData, ...props }) => {
    //Context variables for server calls
    const application = context.application;
    const destApplication = context.destApplication;
    const tenant = context.tenant;

    //Context for updating panelContext (and make panel methods available for other Components to use)
    const { updatePanelContext } = useContext(PanelsContext);
    const [options, setOptions] = useState(props.options || []);
    const [selected, setSelected] = useState(props.record && props.record[id]);
    const [lazyLoading, setLazyLoading] = useState(false);
    const [icon, setIcon] = useState({ icon: props.icon, iconColor: props.iconColor, iconPosition: props.iconPosition });


    useEffect(() => {
        updatePanelContext({
            id,
            setSelected,
            setOptions
        });
    }, []);

    useEffect(() => {
        onLazyLoad();

        return () => { };
    }, [props.record, props.options]);

    const onChange = (_event) => {
        console.log("onChange");
        setSelected(_event.value);
        props.record[id] = _event.value;
        if (props.events?.onChange) {
            props.events.onChange(_event, props.contex);
        }
    };

    const onMouseDown = (_event) => {
        if (props.events?.onMouseDown) {
            props.events.onMouseDown(_event, props.context);
        }
    }
    const onFocus = (_event) => {
        if (props.events?.onFocus) {
            props.events.onFocus(_event, props.context);
        }
    }
    const onBlur = (_event) => {
        if (props.events?.onBlur) {
            props.events.onBlur(_event, props.context);
        }
    }
    const onFilter = (_event) => {
        if (props.events?.onFilter) {
            props.events.onFilter(_event, props.context);
        }
    }


    const onLazyLoad = (event) => {
        setLazyLoading(true);

        if (props?.options?.length) {
            setOptions([...props.options]);
        }
        setLazyLoading(false);
    }

    const virtualScrollerOptions = {
        lazy: true,
        onLazyLoad: onLazyLoad,
        itemSize: props.rowHeight ? props.rowHeight : 45,
        delay: 250,

    }
    if (panelContext._status !== PANEL_STATUS_READY) return;


    //Depending on hasFloatingLabel, the label element must be placed BEFORE or AFTER the <InputText> (-_-)
	const labelEl = <label htmlFor={id} className={classNames("pl-2 w-full", props.labelClassName)}>{props.label}</label>;

    return (
        <React.Fragment>
            <div
                className={classNames("anacleto-input-text-container p-fluid field",
                    props.containerClassName,
                    icon.iconPosition == "left" ? "p-input-icon-left" : "p-input-icon-right", "block",
                    { "p-float-label": props.hasFloatingLabel }
                )}
            >
                {!props.hasFloatingLabel && labelEl}
                <i className={icon.icon} style={{ color: icon.iconColor || "inital" }} />

                <PrimeDropdown
                    id={id}
                    name={props.name}
                    value={selected}
                    options={options}
                    optionLabel={props.optionLabel}
                    optionValue={props.optionValue}
                    optionDisabled={props.optionDisabled}
                    optionGroupLabel={props.optionGroupLabel}
                    optionGroupChildren={props.optionGroupChildren}
                    style={props.style}
                    className={classNames("w-full", props.className)}
                    scrollHeight={props.scrollHeight}
                    filter={props.filter}
                    filterBy={props.filter ? props.filterBy : null}
                    filterMatchMode={props.filterMatchMode}
                    filterPlaceholder={props.filterPlaceholder}
                    filterLocale={props.filterLocale}
                    emptyMessage={props.emptyMessage}
                    emptyFilterMessage={props.emptyFilterMessage}
                    resetFilterOnHide={props.resetFilterOnHide}
                    editable={props.editable}
                    placeholder={props.placeholder}
                    required={props.required}
                    disabled={props.disabled}
                    appendTo={props.appendTo}
                    autoFocus={props.autoFocus}
                    filterInputAutoFocus={props.filterInputAutoFocus}
                    showFilterClear={props.showFilterClear}
                    panelClassName={props.panelClassName}
                    panelStyle={props.panelStyle}
                    dataKey={props.dataKey}
                    inputId={props.inputId}
                    showClear={props.showClear}
                    maxLength={props.maxLength}
                    ariaLabel={props.ariaLabel}
                    ariaLabelledBy={props.ariaLabelledBy}
                    transitionOptions={props.transitionOptions}
                    dropdownIcon={props.dropdownIcon}
                    showOnFocus={props.showOnFocus}
                    virtualScrollerOptions={virtualScrollerOptions}
                    onChange={onChange}
                    onMouseDown={onMouseDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onFilter={onFilter}
                />


                {props.hasFloatingLabel && labelEl}
            </div>
            <small id={`${id}-error-msg`} className="p-error block absolute">
                {props.invalidMessage}
            </small>
        </React.Fragment>
    );

}
Dropdown.propTypes = {
    id: PropTypes.string.isRequired,
    context: PropTypes.object.isRequired,
    panelContext: PropTypes.object.isRequired,
    updatePanelContext: PropTypes.func,
    className: PropTypes.string,
    events: PropTypes.object,
    record: PropTypes.object,
    setRecord: PropTypes.func,
    windowData: PropTypes.any,
    setIsLoading: PropTypes.func,
    isCard: PropTypes.bool,
    className: PropTypes.string,
    optionLabel: PropTypes.string,
    optionValue: PropTypes.string,
    options: PropTypes.array,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    label: PropTypes.string,
};
const MemoDropdown = React.memo(Dropdown, (prev, next) => {
    return defaultMemoizeFunction(Dropdown.propTypes, prev, next);
});

//DisplayName can be used to see a nice name in the ReactDevTools tree instead of "MemoComponentName"
MemoDropdown.displayName = "Dropdown";
export default MemoDropdown;