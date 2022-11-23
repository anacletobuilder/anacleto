import React, { useState, useEffect, useRef, useCallback } from "react";
import components from "../components/components";

export const ComponentsContext = React.createContext({
	componentsContext: {},
	registerComponents: (componentsMap) => {}
});
ComponentsContext.displayName = "ComponentsContext";

const ComponentsContextComponent = (props) => {
	const [componentsContext, setComponentsContext] = useState(components);
	
	const registerComponents = useCallback((componentsMap) => {
		Object.keys(componentsMap).map((componentName) => {
			console.log(`Registering component ${componentName}`);
			if(!componentsContext[componentName]){
				setComponentsContext((prev) => ({
					...prev,
					[componentName]: componentsMap[componentName]
				}))
			}else{
				console.warn(`Component ${componentName} already registered, skipping.`);
			}
		})
	}, []);

	const componentHasProps = useCallback((component, prop) => {
		const comp = componentsContext["Memo" + component] || componentsContext[component];
		if(!comp){ return false }

		const compProps = comp.propTypes || comp.type.propTypes;
	
		if(!compProps){
			console.warn(`Component ${component} doesn't export propTypes. It's always a good idea to export them to make coding easier and more robust.`);
			return false;
		}else if(!compProps[prop]){
			return false;
		}
		return true;
		
	}, [componentsContext]);

	const componentsContextValue = { componentsContext, registerComponents, componentHasProps };

	return <ComponentsContext.Provider value={componentsContextValue}>
		{ props.children }
	</ComponentsContext.Provider>
}

export default ComponentsContextComponent;