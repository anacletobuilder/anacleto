import React, { useState, useEffect, useContext } from "react";
import { classNames } from "primereact/utils";
import { Message } from "primereact/message";
import PropTypes from "prop-types";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { defaultMemoizeFunction } from "../../utils/utils";

/**
 * Contenitore pannelli con struttura a griglia
 */
function GridContainer({ id, context, panelContext, windowData, ...props }) {
	const { updatePanelContext } = useContext(PanelsContext);

	useEffect(() => {
		updatePanelContext({ id });
	}, []);

	if (panelContext._status !== PANEL_STATUS_READY) return;

	return (
		<React.Fragment>
			{props.components &&
				<div
					className={classNames(props.layout == "flex" ? "flex gap-3" : "grid", props.className)}
					style={props.style || {}}>
					{
						React.Children.toArray
							(props.children).filter(c => c).map(c => (
								//use cloneElement for add props to element
								React.cloneElement(c, c.type?.type?.name ? {
									record: props.record, //rember you can use gridContainer in a Form
									setRecord: props.setRecord, //rember you can use gridContainer in a Form
									//[@lucabiasotto 2022-12-23] windowData is already in props, here it's undefined windowData: props.windowData,
								} : {})
							))
					}
				</div>
			}
			{!props.components && <div className="layout-main-container">
				<div className="card">
					<div className="grid">
						<div className="col-12">
							<Message severity="error" text={`Grid container '${id}' has not components.`} />
						</div>
					</div>
				</div>
			</div>}
		</React.Fragment>
	);
}

const MemoGridContainer = React.memo(GridContainer, (prev, next) => {
	return defaultMemoizeFunction(GridContainer.propTypes, prev, next);
});
MemoGridContainer.displayName = "GridContainer";

GridContainer.propTypes = {
	id: PropTypes.string,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	windowData: PropTypes.any,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	components: PropTypes.array,
	isCard: PropTypes.bool,
	toggleable: PropTypes.bool,
	events: PropTypes.object,
	actions: PropTypes.array,
	className: PropTypes.string,
	title: PropTypes.string,
	layout: PropTypes.oneOf(["flex", "grid"]),
	panelBaseMethods: PropTypes.object,
	windowName: PropTypes.string,
	setIsLoading: PropTypes.func,
	children: PropTypes.any,
	style: PropTypes.object,
}
export default MemoGridContainer;
