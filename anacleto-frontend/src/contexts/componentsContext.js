import React, { useState, useEffect, useRef, useCallback } from "react";
import components from "../components/components";

export const ComponentsContext = React.createContext({
	componentsContext: {},
	registerComponent: (componentDefinition) => {}
});
ComponentsContext.displayName = "ComponentsContext";

const ComponentsContextComponent = (props) => {
	const [componentsContext, setComponentsContext] = useState(components);
	
	const registerComponent = useCallback((componentDefinition) => {
		console.log("Registering component", componentDefinition);
	});

	const componentsContextValue = { componentsContext, registerComponent };

	return <ComponentsContext.Provider value={componentsContextValue}>
		{ props.children }
	</ComponentsContext.Provider>
}

export default ComponentsContextComponent;