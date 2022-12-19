import React, { useState, useEffect, useRef, useCallback } from "react";

export const PanelsContext = React.createContext({
	getPanelContext: (id) => {},
	updatePanelContext: (payload) => { },
	resetPanelContext: (id) => {},
});
PanelsContext.displayName = "PanelsContext";

export const PANEL_STATUS_UNAVAILABLE = 0;
export const PANEL_STATUS_INITIALIZING = 1;
export const PANEL_STATUS_RENDERING = 2;
export const PANEL_STATUS_READY = 3;

const PanelsContextComponent = (props) => {
	const [panelsContext, setPanelsContext] = useState({});

	const updatePanelContext = useCallback((payload) => {
		if(!payload.id){
			console.error("payload.id missing - Cannot update panelContext without providing a panel ID!");
			return;
		}
		setPanelsContext((prev) => {
			if(!payload._status) payload._status = PANEL_STATUS_RENDERING;
			if(prev[payload.id]?._status > payload._status || PANEL_STATUS_UNAVAILABLE){
				//Prev status is in a successive status than the payload, don't update
				delete payload._status;
			}

			return {
				...prev,	/* Leave all properties unchanged */
				[payload.id]: {	/* For the given id...*/
					...prev[payload.id], 	/* Keep all existing properties... */
					...payload	/* And add possibile new values */
				}
			}
		});
	});

	const resetPanelContext = useCallback((payload) => {
		if(!payload.id){
			console.error("payload.id missing - Cannot update panelContext without providing a panel ID!");
			return;
		}
		setPanelsContext((prev) => {
			return {
				...prev,
				[payload.id]: {}
			}
		})
	});

	const getPanelContext = useCallback((id) => (panelsContext[id]), [panelsContext]);
	const panelsContextValue = { panelsContext, updatePanelContext, getPanelContext, resetPanelContext };

	return <PanelsContext.Provider value={panelsContextValue}>
		{ props.children }
	</PanelsContext.Provider>
}

export default PanelsContextComponent;