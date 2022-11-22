import React, { useState, useEffect } from "react";
import { Panel as PrimePanel } from "primereact/panel";
import { ScrollPanel as PrimeScrollPanel } from "primereact/scrollpanel";
import Form from "./form";
import TabView from "./tabview";
import Tree from "./tree";
import GridContainer from "./gridcontainer";
import DataTable from "./dataTable";
import { classNames, UniqueComponentId } from "primereact/utils";
import { SplitButton } from "primereact/splitbutton";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import "./panel.css"; //#TEST_FLEX

import Flow from "./flow";
import Preview from "./preview";
import Stack from "./stack";
import Splitter from "./splitter";

/**
 * Classe generica, in base ai metadati del pannello passato, ritorna il pannello coretto
 * @param {Object} props: properties
 * @param {Object} props.panel: dati del pannello
 * @param {Object} props.context: struttura della finestra
 * @returns
 */
function Panel(props) {
	const [panelCollapsed, setPanelCollapsed] = useState(null); //default è false, cambiare qui se si vuole pioltare da metadati
	const [title, setTitle] = useState(props.panel?.title);
	const [showToolbar, setShowToolbar] = useState(true);
	const [showToolbarSpinner, setShowToolbarSpinner] = useState(false);
	const [width, setWidth] = useState(props.width || "col");

	useEffect(() => {
		setWidth(props.width || "col");
	}, [props.width]);

	useEffect(() => {
		// After render
		if (props.panel?.events?.afterRender && typeof props.panel?.events.afterRender === "function") {
			const event = {
				panel: props.panel,
			};
			props.panel?.events.afterRender(event, props.context);
		}
		return () => {
			//unmounting
		};
	}, [props.context, props.context.application, props.context.destapplication, props.context.tenant, props.panel]);

	console.error("panel.js has been moved to component.js. Check what component still uses <Panel /> and change it with <Component />");
	return <React.Fragment></React.Fragment>;
	/**
	 * Ritorna una instanza del pannello giusto in base al tipo
	 * @returns
	 */
	const getPanel = () => {
		//metodi base del pannello
		const panelBaseMethods = {
			setTitle: setTitle,
			showToolbar: setShowToolbar,
			showToolbarSpinner: setShowToolbarSpinner,
			setWidth: setWidth
		};

		let Component, componentProps = {
			panelBaseMethods: panelBaseMethods,
		};
		switch (props.panel?.type?.toLowerCase()) {
			case "form":
				//definisco l'oggetto record, mi servirà nel setState del Form
				const record = {};
				props.panel?.items?.map((item) => {
					record[item.id] = item.value;
				});
				Component = Form;
				componentProps.record = record;
			break;
			case "tabview":
				Component = TabView;
			break;
			case "grid":
				Component = DataTable;
			break;
			case "tree":
				Component = Tree;
			break;
			case "gridcontainer":
				Component = GridContainer;
				componentProps.items = props.panel?.items;
				componentProps.layout = props.panel?.layout;
				componentProps.className = props.panel?.className;
			break;
			case "flow":
				Component = Flow;
				componentProps.child = props.panel?.child;
			break;
			case "localpreview":
				Component = Preview;
				componentProps.items = props.panel?.items;
				componentProps.className = props.panel?.className;
			break;
			case 'stack':
				/* Semplice componente flex */
				Component = Stack;
			break;
			case 'splitter':
				Component = Splitter;
				componentProps.items = props.panel?.items;
				componentProps.className = props.panel?.className;
			break;
		}
		return (
			<React.Fragment>
				{Component && <Component {...props} {...componentProps}></Component>}
				{!Component && <div className="text-center">{props.panel?.title}</div>}
			</React.Fragment>
		)
	};

	//Aggiunge eventualmente un pannello intermedioper gestire le card
	if (props.panel?.isCard) {
		/**
		 * Creo l'header del pannello se è in una card
		 * @param {*} options
		 * @returns
		 */
		const headerTemplate = (options) => {
			//buttoni della toolbar
			const toolbarItems = props.panel?.actions || [];
			const toolbarSplitButtons = toolbarItems.map((_splitButton, _i) => {
				const onClick = function (_event) {
					if (_splitButton.events?.onClick) {
						_splitButton.events.onClick(_event, props.context);
					}
				};

				if (_splitButton.actions && _splitButton.actions.length > 0) {
					//bottone con sottomenù

					const model = _splitButton.actions.map((_action) => {
						_action.command = function (_event) {
							if (_action.events?.onClick) {
								_action.events.onClick(_event, props.context);
							}
						};

						return _action;
					});

					return (
						<SplitButton
							key={`${props.panel?.id}_toolbar_${_i}`}
							className={classNames("p-button-sm",_splitButton.className)}
							label={_splitButton.label}
							icon={_splitButton.icon}
							onClick={onClick}
							model={model}
						/>
					);
				} else {
					//bottone singolo
					return (
						<Button
							key={`${props.panel?.id}_toolbar_${_i}`}
							className={classNames("p-button-sm",_splitButton.className)}
							label={_splitButton.label}
							icon={_splitButton.icon}
							onClick={onClick}
						/>
					);
				}
			});

			//const className = `${options.className} justify-content-start relative`;
			const className = classNames(
				options.className,
				"flex",
				"align-items-center",
				"justify-content-between",
				"p-2"
			);
			const titleClassName = `${options.titleClassName} pl-1 flex align-items-center`;
			return (
				<div className={className}>
					<span className={titleClassName}>
						{title}
						{showToolbarSpinner && (
							<ProgressSpinner
								strokeWidth="5"
								className="ml-2"
								style={{ width: "30px", height: "30px" }}
							/>
						)}
					</span>

					{showToolbar && toolbarSplitButtons}
				</div>
			);
		};

		return (
			<PrimePanel
				className={classNames(
					`panel-${props.panel?.id}`,
					"anacleto-panel-container",
					"anacleto-panel-container-toggleable",
					"flex",
					"flex-column",
					props.className,
					width
				)}
				data-panel={props.panel?.id}
				toggleable={props.panel?.toggleable}
				collapsed={panelCollapsed}
				onToggle={(e) => setPanelCollapsed(e.value)}
				headerTemplate={headerTemplate}
				style={Object.assign({}, props.panel?.style)}
			>
				{getPanel()}
			</PrimePanel>
		);
	}

	//default senza card
	return (
		<div
			className={classNames(
				`container-${props.panel?.id}`,
				"anacleto-panel-container",
				"flex",
				"flex-column",
				props.className,
				width
			)}
			style={Object.assign({}, props.panel?.style)}
		>
			{getPanel()}
		</div>
	);
}

export default Panel;
