import { Button as PrimeButton } from 'primereact/button';
import React, { useContext, useEffect, useState } from 'react';
import { classNames } from "primereact/utils";
import PropTypes from "prop-types";
import { PanelsContext, PANEL_STATUS_READY } from '../../contexts/panelsContext';
import { defaultMemoizeFunction } from '../../utils/utils';
import { getTranslator } from '../../utils/translator';
import { useSelector } from 'react-redux';
import { selectApplication, selectWindow } from '../../reducers/context';

const Button = ({ id, context, panelContext, windowData, ...props }) => {
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);
	const application = useSelector(selectApplication);
	const window = useSelector(selectWindow)
	const t = getTranslator({application, window})

	useEffect(() => {
		updatePanelContext({ id });
	}, []);

	const onClick = function (_event) {
		if (props.onClick) {
			props.onClick.bind({ panel: props, context, windowData, components: panelsContext, updatePanelContext, ...panelContext })(_event);
		} else if (props.events.onClick) {
			props.events.onClick.bind({ panel: props, context, windowData, components: panelsContext, updatePanelContext, ...panelContext })(_event);
		}
	};

	if(panelContext._status !== PANEL_STATUS_READY) return;
	return (
		<div className={classNames("flex-auto", props.containerClassName)}>
			<PrimeButton
				className={classNames(
					"p-button p-2",
					props.className,
					props.icon && !props.label
						? "p-button-rounded p-button-text"
						: ""
				)}
				label={t(id, props.label)}
				icon={props.icon}
				iconPos={props.iconPos}
				badge={props.badge}
				badgeClassName={props.badgeClassName}
				tooltip={props.tooltip}
				tooltipOptions={props.tooltipOptions}
				loading={props.loading}
				loadingIcon={props.loadingIcon}
				onClick={(e) => onClick(e)}
			/>
		</div>
	);
}

const MemoButton = React.memo(Button, (prev, next) => {
	return defaultMemoizeFunction(Button.propTypes, prev, next);
});

MemoButton.displayName = "Button";

Button.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object,
	panelContext: PropTypes.object.isRequired,
	updatePanelContext: PropTypes.func,
	windowData: PropTypes.any,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	setIsLoading: PropTypes.func,
	containerClassName: PropTypes.string,
	className: PropTypes.string,
	isCard: PropTypes.bool,
	panelBaseMethods: PropTypes.object,
	label: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	badge: PropTypes.string,
	badgeClassName: PropTypes.string,
	events: PropTypes.object,
	className: PropTypes.string,
	icon: PropTypes.string,
	iconPos: PropTypes.string,
	loading: PropTypes.string,
	loadingIcon: PropTypes.string,
	onClick: PropTypes.func,
	tooltip: PropTypes.string,
	tooltipOptions: PropTypes.string,
}
export default MemoButton;