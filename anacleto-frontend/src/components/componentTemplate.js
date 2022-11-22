import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { defaultMemoizeFunction } from "../utils/utils";
import { PanelsContext, PANEL_STATUS_READY } from "../contexts/panelsContext";
const { v4: uuidv4 } = require("uuid");

/**
 * ComponentTemplate - Can be copy-pasted to initialize new Components
 */

const ComponentTemplate = ({ id, context, panelContext, ...props }) => {
	//Context variables for server calls
	const application = context.application;
	const destApplication = context.destApplication;
	const tenant = context.tenant;

	//Context for updating panelContext (and make panel methods available for other Components to use)
	const { updatePanelContext } = useContext(PanelsContext);

	useEffect(() => {
		console.log(`Component (ID ${id}) initializing.`);

		//Initialize the panelContext
		updatePanelContext({
			id,
			//Other specific properties and methods
		});
	}, []);

	useEffect(() => {
		console.log(`Component (ID ${id}) status changed.`);
		
		if(panelContext._status === PANEL_STATUS_READY){
			/*
				Panel statuses are
				1- Initializing
				2- Rendering
				3- Ready

				The Component is now READY (This means that props and events are set up and the afterRender event has been called)
			*/
			
		}
	}, [panelContext._status]);


	/*
		If panel isn't ready, interrupt here.

		NOTE: Add all the useEffect hooks ABOVE, as they need to happen before any return statement
	*/
	if(panelContext._status !== PANEL_STATUS_READY) return;

	//Add the Component logic down here, when it is ready to be rendered
	/*
		COMPONENT LOGIC
	*/

	console.log(`Component (ID: ${id}) is rendering`);
	return (
		<React.Fragment />
	);
}
/*
	PropTypes
	Here you can (and should) define all the possible Props that can be passed to the component.
	
	This allows:
	- Better checks (in case a prop has a type different than the expected one, or a missing prop is not passed)
	- Autocompletition helpers for IDEs
	- Auto-Memoization (See below)
*/
ComponentTemplate.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	className: PropTypes.string,
	events: PropTypes.object,
	setIsLoading: PropTypes.func,
	isCard: PropTypes.bool,
};

/*
	Component Memoization
	Prevent the Component from re-rendering multiple times if not necessary.

	When a re-render is expected, React checks the actually rendered props of a component and the new props passed by the re-render event, as well as comparing the rendered DOM tree with the one that should be rendered.
	
	By default, React performs a shallow comparison of all the props, and this might trigger re-renders even if the props haven't changed (functions are always considered as new props).

	Checking the DOM trees is also a "slow" process, especially for bigger components.

	The function below should prevent unnecessary re-renders by comparing previous props and next props ONLY for the props specified in the PropTypes, from this the necessity of exhaustive PropTypes definition.

	This also skips DOM trees comparison, making the process faster as it's definitely faster to compare object keys rather than DOM trees.

	The default function should suffice for most cases, but can be customized for special cases.
	It just needs to return a boolean value where
	"true" tells React to NOT re-render the component (no "important" props have changed)
	"false" tells React to re-render the component (something "important" changed and component should be re-rendered)
*/
const MemoComponentTemplate = React.memo(ComponentTemplate, (prev, next) => {
	return defaultMemoizeFunction(ComponentTemplate.propTypes, prev, next);
});

//DisplayName can be used to see a nice name in the ReactDevTools tree instead of "MemoComponentName"
MemoComponentTemplate.displayName = "ComponentTemplate";

//Finally export the Memoized Component
export default MemoComponentTemplate;