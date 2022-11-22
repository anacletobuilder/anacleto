import React, { useState, useEffect, useRef } from "react";
import { Dialog as PrimeDialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from "primereact/utils";



function InputDialog(props) {

    const [value, setValue] = useState(props.settings.defaultValue || '');
    const [isValidInput, setIsValidInput] = useState(false);
    const [invalidMessage, setInvalidMessage] = useState("");

    useEffect(() => {
        setValue(props.settings.defaultValue );

        return () => {
            console.log('InputDialog component is unmounting');
        };

    }, [props.settings.defaultValue ]);


    const accept = (event) => {
        event.value = value;
        if (props.settings.accept) {
            props.settings.accept(event, props.context)
        }
        hideInputDialog();
    }

    const reject = (event) => {
        if (props.settings.reject) {
            props.settings.reject(event, props.context)
        }
        hideInputDialog();
    }

    const hideInputDialog = () => {
        setValue("");
        setIsValidInput(false);
        setInvalidMessage("");
        props.setInputDialogSettings({ visible: false })
    }


    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={(e) => reject(e)} className="p-button-text" />
                <Button label="Confirm" icon="pi pi-check" onClick={(e) => accept(e)} autoFocus disabled={!isValidInput} />
            </div>
        );
    }

    const onChange = (event) => {
        setValue(event.target.value);

        if (props.settings.validate) {
            //se è stata impostata una funzione di validazione la chiama
            const validatioRes = props.settings.validate(event, props.context) || {success:false};
            if (validatioRes.success) {
                setIsValidInput(true);
                setInvalidMessage("");
            } else {
                setIsValidInput(false);
                setInvalidMessage(validatioRes.message || "");
            }
        } else {
            setIsValidInput(true);
            setInvalidMessage("");
        }
        
    }

    return <PrimeDialog
        id={props.id}
        header={props.settings.header}
        footer={renderFooter()}
        visible={props.settings.visible || false}
        position={props.settings.position}
        modal={props.settings.modal}
        resizable={props.settings.resizable}
        draggable={props.settings.draggable}
        minX={props.settings.minX}
        minY={props.settings.minY}
        keepInViewport={props.settings.keepInViewport}
        headerStyle={props.settings.headerStyle}
        headerClassName={props.settings.headerClassName}
        contentStyle={props.settings.contentStyle}
        contentClassName={props.settings.contentClassName}
        closeOnEscape={props.settings.closeOnEscape}
        dismissableMask={props.settings.dismissableMask}
        rtl={props.settings.rtl}
        closable={props.settings.closable}
        className={props.settings.className}
        maskStyle={props.settings.maskStyle}
        maskClassName={props.settings.maskClassName}
        showHeader={props.settings.showHeader}
        appendTo={props.settings.appendTo}
        baseZIndex={props.settings.baseZIndex}
        maximizable={props.settings.maximizable}
        blockScroll={props.settings.blockScroll}
        icons={props.settings.icons}
        ariaCloseIconLabel={props.settings.ariaCloseIconLabel}
        focusOnShow={props.settings.focusOnShow}
        maximized={props.settings.maximized}
        style={props.settings.style || { width: '50vw' }}
        breakpoints={props.settings.breakpoints || { '960px': '75vw' }}
        transitionOptions={props.settings.transitionOptions}
        onHide={() => { reject(); }}>

        <p>{props.settings.message || ''}</p>


        <div className="field">
        <InputText
            value={value}
            aria-describedby="dialog-input-error-help"
            onChange={onChange}
            className={classNames("w-full", (!isValidInput && invalidMessage) ? "p-invalid block" : "")} />

            <small id="dialog-input-error-help" className="p-error block">{invalidMessage}</small>
        </div>

        


    </PrimeDialog>
}

export default InputDialog;
