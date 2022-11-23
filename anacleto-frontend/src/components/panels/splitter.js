import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useState } from "react";
import { Splitter as PrimeSplitter, SplitterPanel } from 'primereact/splitter';
import MemoComponent from "../component";
import PropTypes from "prop-types";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { defaultMemoizeFunction } from "../../utils/utils";
const { v4: uuidv4 } = require('uuid');

const Splitter = ({ id, context, panelContext, ...props }) => {
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);

	useEffect(() => {
		updatePanelContext({ id });
	}, []);

	if(panelContext._status !== PANEL_STATUS_READY) return;
	
	return (
		<PrimeSplitter className={classNames("anacleto-splitter border-none", props.className)}>
			{ props.items && props.items.map((c) => 
				<SplitterPanel key={c.id || uuidv4()} size={ c.size } className="flex">
					<MemoComponent component={c} context={props.context} {...c} />
				</SplitterPanel>
			) }
		</PrimeSplitter>
	);
}
const MemoSplitter = React.memo(Splitter, (prev, next) => {
	return defaultMemoizeFunction(Splitter.propTypes, prev, next);
});
MemoSplitter.displayName = "Splitter";

Splitter.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	updatePanelContext: PropTypes.func,
	forwardData: PropTypes.any,
record: PropTypes.object,
setRecord: PropTypes.func,
	setIsLoading: PropTypes.func,
	items: PropTypes.array,
	className: PropTypes.string,
	isCard: PropTypes.bool,
	title: PropTypes.string,
	panelBaseMethods: PropTypes.object,
};
export default MemoSplitter;