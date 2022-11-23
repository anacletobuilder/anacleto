import React, { useState, useEffect, useContext } from "react";
import {
	TabView as PrimeTabView,
	TabPanel as PrimeTabPanel,
} from "primereact/tabview";
import { classNames } from "primereact/utils";
import MemoComponent from "../component";
import PropTypes from "prop-types";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { defaultMemoizeFunction } from "../../utils/utils";
/**
 * Pannello tab
 * @param {Object} props: properties
 * @param {Object} props.context: struttura della finestra
 * @returns
 */
const TabView = ({ id, context, panelContext, ...props }) => {
	const { updatePanelContext } = useContext(PanelsContext);
	const [activeIndex, setActiveIndex] = useState(0); //default è 0, cambiare qui se si vuole pilotare da metadati

	useEffect(() => {
		updatePanelContext({
			id,
			getActiveIndex: () => (activeIndex),
		});
	}, [activeIndex]);
	
	if(panelContext._status !== PANEL_STATUS_READY) return;
	
	const getItems = () => {
		if (!props.items) {
			//no subpanel set
			return <PrimeTabPanel key={"no_item"} />;
		}

		const items = props.items.map((item) => {
			return (
				<PrimeTabPanel
					className={classNames("p-0")}
					key={item.id + "_tabPanel"}
					header={item.title}
					contentClassName="h-full flex"
				>
					<MemoComponent
						className={classNames("p-0 m-0")}
						key={item.id}
						component={item.component}
						{...item}
					/>
				</PrimeTabPanel>
			);
		});
		return items;
	};

	return (
		<PrimeTabView
			panelContainerStyle={{
				...props.style,
				overflow: "auto",
				height: "calc(100% - 3rem)",
			}}
			activeIndex={activeIndex}
			onTabChange={(e) => setActiveIndex(e.index)}
		>
			{getItems()}
		</PrimeTabView>
	);
}
const MemoTabView = React.memo(TabView, (prev, next) => {
	return defaultMemoizeFunction(TabView.propTypes, prev, next);
});
MemoTabView.displayName = "TabView";
TabView.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	updatePanelContext: PropTypes.func,
	forwardData: PropTypes.any,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	setIsLoading: PropTypes.func,
	items: PropTypes.array,
	panelBaseMethods: PropTypes.object,
	style: PropTypes.object,
	title: PropTypes.string,
	isCard: PropTypes.bool,
	toggleable: PropTypes.bool,
	actions: PropTypes.array,
	className: PropTypes.string,
};
export default TabView;
