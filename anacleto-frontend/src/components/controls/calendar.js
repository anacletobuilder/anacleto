import { Calendar as PrimeCalendar }  from 'primereact/calendar';
import { getClassNames } from "./utilityControls";


const Calendar = (config) => {
    const onChange = function (_event) {
        const newValue = _event.target.value;
        config.onChange(newValue); //imposta il valore nella context

        //chiama l'eventuale evento custom definita dall'utente
        if (config.onChange) {
            config.onChange(_event, config.context, newValue)
        }
    }

    const onFocus = function (_event) {
        if(config.onFocus){
            config.onFocus(_event);
        }
    }
    const onBlur = function (_event) {
        if(config.onBlur) {
            config.onBlur(_event);
        }
    }
    const onInput = function (_event) {
        if(config.onInput) {
            config.onInput(_event);
        }
    }
    const onSelect = function (_event) {
        if(config.onSelect) {
            config.onSelect(_event);
        }
    }

    const onTodayButtonClick = function (_event) {
        if(config.onTodayButtonClick) {
            onTodayButtonClick(_event);
        }
    }
    const onClearButtonClick = function (_event) {
        if(config.onClearButtonClick) {
            onClearButtonClick(_event);
        }
    }
    const onViewDateChange = function (_event) {
        if(config.onViewDateChange) {
            onViewDateChange(_event);
        }
    }
    const onShow = function (_event) {
        if(config.onShow) {
            onShow(_event);
        }
    }
    const onHide = function (_event) {
        if(config.onHide) {
            onHide(_event);
        }
    }
    const onVisibleChange = function (_event) {
        if(config.onVisibleChange) {
            onVisibleChange(_event);
        }
    }
    return <PrimeCalendar
        id={config.id}
        name={config.name}
        value={config.value}
        visible={config.visible}
        viewDate={config.viewDate}
        style={config.style}
        className={getClassNames(config)}
        inline={config.inline}
        inputId={config.inputId}
        inputStyle={config.inputStyle}
        inputClassName={config.inputClassName}
        inputMode={config.inputMode}
        required={config.required}
        readOnlyInput={config.readOnlyInput}
        keepInvalid={config.keepInvalid}
        mask={config.mask}
        disabled={config.disabled}
        tabIndex={config.tabIndex}
        placeholder={config.placeholder}
        showIcon={config.showIcon}
        icon={config.showIcon ? (config.icon ? config.icon : "pi pi-calendar"): null}
        iconPos={config.showIcon ? (config.iconPos ? config.iconPos : "right"): null}
        showOnFocus={config.showOnFocus}
        numberOfMonth={config.numberOfMonths}
        view={config.view}
        touchUI={config.touchUI}
        showTime={config.showTime}
        timeOnly={config.timeOnly}
        showSeconds={config.showSeconds}
        showMillisec={config.showMillisec}
        hourFormat={config.hourFormat}
        locale={config.locale}
        stepHour={config.stepHour}
        stepMinute={config.stepMinute}
        stepSecond={config.stepSecond}
        stepMillisec={config.stepMillisec}
        shortYearCutoff={config.shortYearCutoff}
        hideOnDateTimeSelect={config.hideOnDateTimeSelect}
        showWeek={config.showWeek}
        dateFormat={config.dateFormat}
        panelStyle={config.panelStyle}
        panelClassName={config.panelClassName}
        monthNavigator={config.monthNavigator}
        yearNavigator={config.yearNavigator}
        disabledDates={config.disabledDates}
        disabledDays={config.disabledDays}
        minDate={config.minDate}
        maxDate={config.maxDate}
        maxDateCount={config.maxDateCount}
        showOtherMonths={config.showOtherMonths}
        selectOtherMonths={config.selectOtherMonths}
        showButtonBar={config.showButtonBar}
        todayButtonClassName={config.todayButtonClassName}
        clearButtonClassName={config.clearButtonClassName}
        baseZIndex={config.baseZIndex}
        autoZIndex={config.autoZIndex}
        appendTo={config.appendTo}
        tooltip={config.tooltip}
        tooltipOptions={config.tooltipOptions}
        ariaLabelledBy={config.ariaLabelledBy}
        dateTemplate={config.dateTemplate}
        monthNavigatorTemplate={config.monthNavigatorTemplate}
        yearNavigatorTemplate={config.yearNavigatorTemplate}
        transitionOptions={config.transitionOptions}
        onFocus={(e)=>{onFocus(e)}}
        onBlur={(e)=>{onBlur(e)}}
        onInput={(e)=>{onInput(e)}}
        onSelect={(e)=>{onSelect(e)}}
        onChange={(e)=>{onChange(e)}}
        onTodayButtonClick={(e)=>{onTodayButtonClick(e)}}
        onClearButtonClick={(e)=>{onClearButtonClick(e)}}
        onViewDateChange={(e)=>{onViewDateChange(e)}}
        onShow={(e)=>{onShow(e)}}
        onHide={(e)=>{onHide(e)}}
        onVisibleChange={(e)=>{onVisibleChange(e)}}
    />
}

export default Calendar;