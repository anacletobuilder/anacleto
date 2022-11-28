import { Panel as PrimePanel } from "primereact/panel";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Skeleton } from "primereact/skeleton";
import { SplitButton } from "primereact/splitbutton";
import { classNames } from "primereact/utils";
import PropTypes from "prop-types";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { ComponentsContext } from "../contexts/componentsContext";
import { PanelsContext, PANEL_STATUS_INITIALIZING, PANEL_STATUS_READY, PANEL_STATUS_RENDERING } from "../contexts/panelsContext";
import { selectContext } from "../reducers/context";
import MemoButton from "./controls/button";
import utils, {getFunctionFromMetadata} from "../utils/utils";
import ErrorPage from "./errorPage";
import { useErrorBoundary, withErrorBoundary } from "react-use-error-boundary";
const { v4: uuidv4 } = require('uuid');


const Component = withErrorBoundary(({ component, ...props }) => {
	const context = useSelector(selectContext);
	const [error, resetError] = useErrorBoundary(
		//(error, errorInfo) => console.error(error, errorInfo)
	);
	const { panelsContext, updatePanelContext, resetPanelContext } = useContext(PanelsContext);
	const [panelContext, setPanelContext] = useState({});
	const { componentsContext, componentHasProps } = useContext(ComponentsContext);
	const [title, setTitle] = useState(props.title);
	const [panelCollapsed, setPanelCollapsed] = useState(null);
	const [isLoading, setIsLoading] = useState(props.isLoading || false);
	const [showToolbar, setShowToolbar] = useState(true);
	const [isToolbarLoading, setIsToolbarLoading] = useState(false);
	const [items, setItems] = useState(props.items);
	const [invalidMessage, setInvalidMessage] = useState("");
	const [label, setLabel] = useState(props.label);
	const [className, setClassName] = useState(props.className || "");

	const panelBaseMethods = {
		setTitle,
		setShowToolbar,
		setIsLoading,
		setItems,
		setInvalidMessage,
		setLabel,
		setIsLoading,
		setClassName: useCallback((newClass) => {
			if(newClass){
				setClassName((prev) => prev + " " + newClass);
			}
		}, []),
	};
	const [events, setEvents] = useState({});

	useEffect(() => {
		//Component mount!
		//console.log("Component - Initializing", component, props.id);

		//Immediately set the baseMethods for all the panels
		let initialPanelContext = {
			id: props.id,
			_status: PANEL_STATUS_INITIALIZING,
			...panelBaseMethods
		};
		if (props.isCard) {
			initialPanelContext.setIsToolbarLoading = setIsToolbarLoading;
		}
		updatePanelContext(initialPanelContext);

		return (() => {
			//console.log("Component - Unmounting ", component, props.id);
			resetPanelContext({ id: props.id });

			if (events.onUnload) {
				try {
					events.onUnload.bind({ panel: props, context, panelsContext, updatePanelContext, ...panelContext })();
				} catch (e) {
					console.error(e);
				}
			}
		});
	}, []);

	//Update THIS component's panelContext
	useEffect(() => {
		if (!panelsContext || typeof panelsContext[props.id] === typeof undefined) return;
		if (panelContext !== panelsContext[props.id]) {
			setPanelContext(panelsContext[props.id]);
		}
	}, [panelsContext]);


	useEffect(() => {
		let statuses = { 1: "INITIALIZING", 2: "RENDERING", 3: "READY" };
		//if(panelContext._status) console.log("Component - Status", component, props.id, statuses[panelContext._status]);
		if(panelContext._status === PANEL_STATUS_RENDERING){
			//panelContext should now contain all the necessary methods used by events
			let _evts = {}
			for (let e in props.events) {
				_evts[e] = getFunctionFromMetadata(props.events[e]);
			}
			_evts._status = PANEL_STATUS_READY;
			setEvents(_evts);
		}
	}, [panelContext?._status]);

	useEffect(() => {
		// After render
		if (events?._status === PANEL_STATUS_READY && panelContext?._status === PANEL_STATUS_RENDERING) {
			if (events.afterRender) {
				console.log(`Calling method afterRender for component ${component} (ID: ${props.id}). Context, event: `, panelContext, events.afterRender);
				try {
					events.afterRender.bind({ panel: props, context, panelsContext, updatePanelContext, ...panelContext })();
					updatePanelContext({
						id: props.id,
						_status: PANEL_STATUS_READY
					});
				} catch (e) {
					console.warn(`Method afterRender for component ${component} (ID: ${props.id}) threw an error. Maybe a method is not yet defined in the panelContext, in that case the afterRender will retry when new events are defined until it is successfull. Error: `, e);
				}
			} else {
				//No afterRender event, panel is ready
				updatePanelContext({
					id: props.id,
					_status: PANEL_STATUS_READY
				});
			}
		}
	}, [events, panelContext]);

	useEffect(() => {
		setItems(props.items);
	}, [props.items]);

	/*
		HELPER CHECKS
		This section is used to trigger warning or errors depending on how components are implemented
	*/
	if (!component) {
		console.error("Component is not defined", props);
		return;
	}

	if(!props.id){
		console.error("Component ID not defined. All Components should have an ID", props);
	}

	if (!componentsContext["Memo" + component] && !componentsContext[component]) {
		console.error(`Component ${component} is not implemented. Available Components (Case Sentitive): `, Object.keys(componentsContext).map((c) => c.replace(/^Memo/, "")).join(", "));
		return;
	}
	if (!componentsContext["Memo" + component]) {
		console.warn(`Component ${component} doesn't export a Memoized version of the component. It is always a good idea to Memoize a component to improve performances.`);
	}

	const RenderComponent = componentsContext["Memo" + component] || componentsContext[component];
	for (let p in props) {
		//Check if component has props (and show the warnings otherwise)
		if (!componentHasProps(component, p)) {
			console.warn(`PropType ${p} unknown for component ${component}.`);
		};
	}
	const RenderComponentPropTypes = RenderComponent.propTypes || RenderComponent.type.propTypes;
	if (RenderComponentPropTypes) {
		if (!RenderComponentPropTypes.id) { console.error(`Component ${component} doesn't export the propType 'id'. It must be exported to ensure a correct context management.`); }
		if (!RenderComponentPropTypes.context) { console.warn(`Component ${component} doesn't export the propType 'context'. It should be exported otherwise the component won't be updated if context updates.`); }
		if (!RenderComponentPropTypes.panelContext) { console.warn(`Component ${component} doesn't export the propType 'panelContext'. It should be exported otherwise the component won't be updated if its context updates.`); }
	}
	/*
		END OF HELPER CHECKS
	*/

	const loadingSpinner = <div className={classNames("spinner-wrapper absolute w-full h-full top-0 left-0 z-5 border-round")} style={{
		background: "rgba(0, 0, 0, 0.1)",
		backdropFilter: "blur(1px)"
	}}>
		<ProgressSpinner
			className="absolute w-full h-full top-50 left-50"
			strokeWidth="5"
			style={{ maxWidth: "50px", maxHeight: "50px", transform: "translate(-50%, -50%" }}
		/>
	</div>;


	const defaultProps = {
		context,
		panelContext,
		invalidMessage,
		label,
		events,
	}

	//Use forwardData to forward input data to children components
	const content = <React.Fragment>
		{ props.isCard && isLoading && loadingSpinner }
		{ RenderComponent && <RenderComponent {...props} {...defaultProps} key={props.id} className={classNames(`component-${props.id} relative`, className)/* Removed className overflow-hidden, maybe it's not needed anymore*/}>
			{ !props.isCard && isLoading && loadingSpinner }
			{ items?.map(({component, ...compProps}) => (
				<MemoComponent {...compProps} key={compProps.id || uuidv4()} component={ component } setIsLoading={setIsLoading}/>
			))}
			{ props.children }
		</RenderComponent>}
	</React.Fragment>;

	let container;
	if(props.isCard){
		const getHeaderTemplate = (options) => {
			//buttoni della toolbar
			const toolbarItems = props.actions || [];
			const toolbarSplitButtons = toolbarItems.map((_splitButton, _i) => {
				const onClick = function (_event) {
					if (_splitButton.events?.onClick){
						//Convert and execute the function
						getFunctionFromMetadata(_splitButton.events.onClick).bind({ panel: props, context, panelsContext, updatePanelContext, ...panelContext })(_event);
					}
				};

				if (_splitButton.actions && _splitButton.actions.length > 0) {
					//bottone con sottomenù

					const model = _splitButton.actions.map((_action) => {
						_action.command = function (_event) {
							if (_action.events?.onClick){
								//Convert and execute the function
								getFunctionFromMetadata(_action.events.onClick).bind({ panel: props, context, panelsContext, updatePanelContext, ...panelContext })(_event);
							}
						};

						return _action;
					});

					return (
						<SplitButton
							id={_splitButton.id}
							key={`${props.id}_toolbar_${_i}`}
							className={classNames("p-button-sm mb-0", _splitButton.className)}
							label={_splitButton.label}
							icon={_splitButton.icon}
							onClick={onClick}
							model={model}
						/>
					);
				} else {
					//bottone singolo
					return (
						<MemoButton
							id={_splitButton.id}
							key={`${props.id}_toolbar_${_i}`}
							containerClassName={classNames("text-right")}
							className={classNames("p-button-sm mb-0 col-6 md:col-2", _splitButton.className)}
							label={_splitButton.label}
							icon={_splitButton.icon}
							onClick={onClick}
							context={context}
							panelContext={{ /* Nothing to initialize here */ _status: PANEL_STATUS_READY }}
						/>
					);
				}
			});

			return <div className="p-4 flex align-items-start flex-row md:align-items-center md:justify-content-between -mb-6">
				<div className="mb-3 md:mb-0">
					<div className="p-card-title m-0">{title}</div>
					{props.subtitle && <div className="p-card-subtitle mt-2 mb-0">{props.subtitle}</div>}
				</div>
				{showToolbar && toolbarSplitButtons}
			</div>
		};
		container = <div className={classNames("flex flex-auto", props.containerClassName)}>
			<Card
				header={getHeaderTemplate}
				className={classNames("flex-auto")}
				key={"card-wrapper-" + props.id}
			>
				{content}
			</Card>
		</div>
	}else{
		container = <React.Fragment>{content}</React.Fragment>
	}

	if(error){
		const message = <div className="flex flex-column w-full">
			<b className="text-red-600">Error: {error.message}</b>
			<pre className="h-full w-full overflow-auto text-sm text-left">{error.stack}
			</pre>
		</div>
		return <ErrorPage
			code=" "
			title="Component rendering error"
			message={message}
			showHomeButton={false}
		/>
	}
	return container;
});

const MemoComponent = React.memo(Component);
MemoComponent.displayName = "Component";

Component.propTypes = {
	id: PropTypes.string.isRequired,
	component: PropTypes.string.isRequired
}
export default MemoComponent;
