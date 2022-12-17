import ReactFlow, {
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	useKeyPress,
	ReactFlowProvider,
} from "react-flow-renderer";
import { classNames } from "primereact/utils";
import dagre from "dagre";
import addButtonEdge from "../customFlow/edges/buttonsEdge";
import {
	itemNode,
	windowNode,
	eventNode,
	action,
	addNode,
	addEventNode,
	addAction,
} from "../customFlow/nodes/itemNode";
import React, { useEffect, useCallback, useMemo, useState, useContext } from "react";
import PropTypes from "prop-types";
import { PanelsContext } from "../../contexts/panelsContext";
import { useSelector } from "react-redux";
import { selectDestApplication } from "../../reducers/context";
import { defaultMemoizeFunction } from "../../utils/utils";

const initNodes = [];
const initEdges = [];

function Flow({ id, context, panelContext, ...props }) {
	const destApplication = useSelector(selectDestApplication);

	const { panelsContext, updatePanelContext } = useContext(PanelsContext);
	const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
	const [rfInstance, setRfInstance] = useState(null);
	const edgeTypes = useMemo(() => ({
			addbuttonedge: addButtonEdge,
		}), []
	);
	const nodeTypes = useMemo(() => ({
			itemnode: itemNode,
			windownode: windowNode,
			eventnode: eventNode,
			addnode: addNode,
			addeventnode: addEventNode,
			addaction: addAction,
			action: action,
		}), []
	);

	useEffect(() => {
		//Update context as it points to state variables subject to changes
		updatePanelContext({
			id,
			flowToMap: convertFlowToMap,
			mapToFlow: convertMapToFlow,
		});
	}, [nodes, edges]);

	//Funzioni FLOW -> MAP e MAP -> FLOW -> MAP
	const convertFlowToMap = (id, nodeArr) => {
		if (!nodeArr) {
			nodeArr = nodes;
		}
		if (!id || !nodeArr) {
			return undefined;
		}
		var elem = nodeArr.filter(function (n) {
			return n.id == id;
		});
		var obj = elem[0].attributes;
		var itemChilds = nodeArr.filter(function (n) {
			return n.ancestorNode == id && n.type == "itemnode";
		});
		itemChilds = itemChilds.sort(function (a, b) {
			return a.itemPosition - b.itemPosition;
		});
		if (itemChilds.length > 0) {
			obj.components = [];
			for (var i in itemChilds) {
				obj.components.push(convertFlowToMap(itemChilds[i].id, nodeArr));
			}
		}
		var events = nodeArr.filter(function (n) {
			return n.ancestorNode == id && n.type == "eventnode";
		});
		var addEventsNode = nodeArr.filter(function (n) {
			return n.ancestorNode == id && n.type == "addeventnode";
		});
		if (events.length > 0) {
			if (!obj.events) {
				obj.events = {};
			}
			for (var e in events) {
				obj.events[events[e].attributes.title] =
					events[e].attributes.value;
			}
		} else if (addEventsNode.length > 0 && !obj.events) {
			obj.events = {};
		}

		var toolbarBtns = nodeArr.filter(function (n) {
			return n.ancestorNode == id && n.type == "action";
		});
		var addToolBtns = nodeArr.filter(function (n) {
			return n.ancestorNode == id && n.type == "addaction";
		});
		if (toolbarBtns.length > 0) {
			obj.actions = [];
			for (var i in toolbarBtns) {
				obj.actions.push(convertFlowToMap(toolbarBtns[i].id, nodeArr));
			}
		} else if (addToolBtns.length > 0 && !obj.actions) {
			obj.actions = [];
		}

		return obj;
	};

	//Disposizione NODI nel flow
	const dagreGraph = new dagre.graphlib.Graph();
	dagreGraph.setDefaultEdgeLabel(() => ({}));

	const nodeWidth = 350;
	const nodeHeight = 50;
	//Impostazione nodi
	const convertMapToFlow = (map) => {
		var initialNodes = [];
		var initialEdges = [];
		const composeNodesAndEdges = (obj, parentNode) => {
			var itm = {};
			var node = {
				position: {
					x: 0,
					y: 0,
				},
				draggable: false,
				context,
			};
			for (var attr in obj) {
				if (attr == "itemPosition") {
					node.itemPosition = obj[attr];
				} else if (
					attr == "components" ||
					attr == "events" ||
					attr == "actions"
				) {
					continue;
				} else {
					itm[attr] = obj[attr];
				}
			}

			var typeDef = "";

			if (itm.window) {
				typeDef = "WINDOW";
				itm.id = itm.window;
			}
			if (itm.type) {
				typeDef = itm.type;
			}
			if (itm.subtype) {
				typeDef += " - " + itm.subtype;
			}
			node.data = {
				label: itm.title ? itm.title : itm.label ? itm.label : itm.id,
				attributeType: typeDef,
			};

			node.id = itm.id;
			node.attributes = itm;

			if (!parentNode) {
				node.type = "windownode";
			} else {
				node.ancestorNode = parentNode;
				if (obj.nodeType) {
					node.type = obj.nodeType;
					delete itm.nodeType;
				} else {
					node.type = "itemnode";
				}
			}
			initialNodes.push(node);

			if (
				!obj.components &&
				itm.id?.indexOf("ADDNEWITM") < 0 &&
				itm.id?.indexOf("_EVENT_") < 0 &&
				itm.id?.indexOf("_ADDEVENT") < 0
			) {
				//Se non ho components non devo avere possibilità di aggiungere figli
			}

			if (parentNode) {
				initialEdges.push({
					id: parentNode + "|" + node.id,
					source: parentNode,
					target: node.id,
					type: "smoothstep",
				});
			}

			var siblingPosition = 0;

			if (obj.components) {
				for (var i = 0; i < obj.components.length; i++) {
					var currItm = obj.components[i];
					currItm.itemPosition = siblingPosition;
					siblingPosition++;
					composeNodesAndEdges(currItm, node.id);
				}
				composeNodesAndEdges(
					{
						id: node.id + "_ADDNEWITM",
						title: "Add object",
						nodeType: "addnode",
						itemPosition: obj.components.length,
					},
					node.id
				);
				siblingPosition++;
			}
			if (obj.events) {
				for (var e in obj.events) {
					if (obj.events.hasOwnProperty(e)) {
						composeNodesAndEdges(
							{
								id: node.id + "_EVENT_" + e,
								title: e,
								type: "EVENT",
								nodeType: "eventnode",
								eventType: e,
								value: obj.events[e],
								itemPosition: siblingPosition,
							},
							node.id
						);
						siblingPosition++;
					}
				}
				composeNodesAndEdges(
					{
						id: node.id + "_ADDEVENT",
						title: e,
						eventType: e,
						type: "EVENT",
						nodeType: "addeventnode",
						itemPosition: siblingPosition,
					},
					node.id
				);
				siblingPosition++;
			}

			if (obj.actions) {
				for (var i = 0; i < obj.actions.length; i++) {
					var currToolObj = obj.actions[i];
					currToolObj.itemPosition = siblingPosition;
					siblingPosition++;
					currToolObj.type = "action";
					currToolObj.nodeType = "action";
					composeNodesAndEdges(currToolObj, node.id);
				}
				composeNodesAndEdges(
					{
						id: node.id + "_ADDACTION",
						title: e,
						eventType: e,
						type: "TOOLBAR BUTTON",
						nodeType: "addaction",
						itemPosition: siblingPosition,
					},
					node.id
				);
			}
		};
		composeNodesAndEdges(map, null);

		const getLayoutedElements = (nodes, edges, direction = "LR") => {
			const isHorizontal = true;
			dagreGraph.setGraph({
				rankdir: direction,
			});

			nodes.forEach((node) => {
				dagreGraph.setNode(node.id, {
					width: nodeWidth,
					height: nodeHeight,
				});
			});

			edges.forEach((edge) => {
				dagreGraph.setEdge(edge.source, edge.target);
			});

			dagre.layout(dagreGraph);

			nodes.forEach((node) => {
				const nodeWithPosition = dagreGraph.node(node.id);
				node.targetPosition = isHorizontal ? "left" : "top";
				node.sourcePosition = isHorizontal ? "right" : "bottom";

				// We are shifting the dagre node position (anchor=center center) to the top left
				// so it matches the React Flow node anchor point (top left).
				node.position = {
					x: nodeWithPosition.x - nodeWidth / 2,
					y: nodeWithPosition.y - nodeHeight / 2,
				};

				return node;
			});

			return { nodes, edges };
		};

		const layoutedData = getLayoutedElements(initialNodes, initialEdges);
		setNodes(layoutedData.nodes);
		setEdges(layoutedData.edges);
	};

	useEffect(() => {
		//Inside useEffect so that it doesn't interfere with ApplicationBuilder render!
		updatePanelContext({
			id,
			flowToMap: convertFlowToMap,
			mapToFlow: convertMapToFlow,
			setNodes,
			setEdges
		});

		window.utils
		.callServer({
			url: "/window",
			method: "get",
			contentType: "application/javascript",
			params: {
				application: destApplication,
				window: window.utils.getSearchParam("window"),
				getRawData: true,
			},
		})
		.then(function (response) {
			convertMapToFlow(response.data);
		});
	}, []);
	
	const onNodeClick = (event, node) => {
		const forwardData = {
			node,
			rfInstance,
			convertMapToFlow,
			convertFlowToMap,
			emptyNode: {
				position: { x: 0, y: 0 },
				draggable: false,
				context,
			},
		};
		if(props.events.onNodeClick){
			props.events.onNodeClick.bind({ panel: props, context, components:panelsContext, updatePanelContext, ...panelContext })(event, forwardData);
		}
		if (node.type == "addnode") {
			//alert("Aggiungi controllo");
			var parentNode = node.id.replace("_ADDNEWITM", "");
			window.utils.openWindow({
				window: "add_node",
				type: "modal",
				settings: {
					header: `Add node to: ${parentNode}`,
				},
				forwardData: { ...forwardData, parentNode}
			});
		} else if (node.type == "addeventnode") {
			var parentNode = node.id.replace("_ADDEVENT", "");
			window.utils.openWindow({
				window: "add_event",
				type: "modal",
				settings: {
					header: `Add event to: ${parentNode}`,
					maximizable: true,
				},
				forwardData: { ...forwardData, parentNode}
			});
		} else if (node.type == "eventnode") {
			debugger;
			window.utils.openWindow({
				window: "add_event",
				type: "modal",
				settings: {
					header: `Modify event`,
					maximizable: true,
					contentClassName: "flex-column",
				},
				forwardData: { ...forwardData, parentNode}
			});
		} else if (node.type == "addaction") {
			var parentNode = node.id.replace("_ADDACTION", "");
			window.utils.openWindow({
				window: "add_action",
				type: "modal",
				settings: {
					header: `Add action to: ${parentNode}`,
				},
				forwardData: { ...forwardData, parentNode}
			});
		}/* else {
			window.utils.openWindow({
				window: "node_info",
				type: "dialog",
				settings: {
					header: "Informazioni",
					actions: [
						{
							"id": "windows_node_footer_save",
							"component": "Button",
							"containerClassName": "col-12 h-3rem",
							"icon":"pi pi-save",
							"label": "SAVE",
							"events" : {
								"onClick": {
									"body": "console.log('saving');"
								}
							}
						},
						{
							"id": "windows_node_footer_delete",
							"component": "Button",
							"containerClassName": "col-12 h-3rem",
							"className":"p-button-outlined p-button-danger",
							"icon":"pi pi-trash",
							"label": "DELETE",
							"events" : {
								"onClick": {
									"body": "const _this = this;utils.showConfirmDialog({ message: 'Do you want to delete this node?', header: 'Delete Confirmation', icon: 'pi pi-info-circle', acceptClassName: 'p-button-danger', accept: function () { var forwardData = this.forwardData; var currentNode = forwardData.node; var instance = forwardData.rfInstance; var nodes = instance.getNodes(); var edges = instance.getEdges(); const removeChildNodes = function (parentNode) { var childNodes = nodes.filter(el => el.ancestorNode == parentNode); if(childNodes.length > 0) { for(var i = 0; i < childNodes.length; i++) { var nIndex = nodes.findIndex(el => el.id == childNodes[i].id); if(nIndex > -1) { nodes.splice(nIndex,1); removeChildNodes(childNodes[i].id); filterEdges(childNodes[i].id); } } } }; const filterEdges = function(nodeId) { console.log('filterEdges',nodeId); edges = edges.filter(el => el.target != nodeId); }; var currentNodeIndex = nodes.findIndex(el => el.id == currentNode.id); if(currentNodeIndex > -1) { nodes.splice(currentNodeIndex,1); filterEdges(currentNode.id); removeChildNodes(currentNode.id); var siblingNodes = nodes.filter(el => el.ancestorNode == currentNode.ancestorNode); console.log(siblingNodes); for(var i = 0; i < siblingNodes.length; i++) { var siblingIndex = nodes.findIndex(el => el.id == siblingNodes[i].id); if(nodes[siblingIndex].itemPosition > currentNode.itemPosition) { nodes[siblingIndex].itemPosition--; } } } const windowId = utils.getSearchParam('window'); const windowMap = forwardData.convertFlowToMap(windowId,nodes); forwardData.convertMapToFlow(windowMap); _this.closeWindow(); }, reject: function () { }});"
								}
							}
						}
					]
				},
				forwardData
			});
		}*/
	};

	const metaAndKPressed = useKeyPress(["Meta+Shift+o", "Strg+Shift+o"]);
	useEffect(() => {
		if (metaAndKPressed) {
			console.log("metaAndKPressed", metaAndKPressed);
			window.utils.openWindow({
				window: "search_node",
				type: "modal",
				settings: {
					header: "Search node",
				},
				forwardData: {
					rfInstance: rfInstance,
				},
			});
		}
	}, [metaAndKPressed]);

	return (
		<ReactFlowProvider
			className={classNames(
				"align-content-start",
				props.className
			)}
		>
			<div className="flex-auto" style={{ minHeight: "50vh" }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					edgeTypes={edgeTypes}
					nodeTypes={nodeTypes}
					onInit={setRfInstance}
					panOnScroll={true}
					panOnDrag={true}
					onNodeClick={(event, node) => onNodeClick(event, node)}
					style={{ height: "100%", width: "100%" }}
					fitView
				>
					<MiniMap
						nodeStrokeColor={(n) => {
							if (n.style?.background) return n.style.background;
							if (n.type === "addnode") return "#8f48d2";
							if (n.type === "addeventnode") return "#1da750";
							if (n.type === "itemnode" || n.type === "windownode")
								return "#3b82f6";
							if (n.type === "eventnode") return "#22c55e";

							return "#eee";
						}}
						nodeColor={(n) => {
							if (n.style?.background) return n.style.background;
							/*
			if (n.type === 'addnode') return '#8f48d2';
			if (n.type === "addeventnode") return "#1da750";
			if (n.type === 'itemnode' || n.type === "windownode") return '#3b82f6';
			if (n.type === 'eventnode') return '#22c55e';
			*/
							return "#fff";
						}}
						nodeBorderRadius={4}
					/>
					<Controls />
					<Background color="#aaa" gap={16} />
				</ReactFlow>
			</div>
		</ReactFlowProvider>
	);
}
const MemoFlow = React.memo(Flow, (prev, next) => {
	return defaultMemoizeFunction(Flow.propTypes, prev, next);
});
MemoFlow.displayName = "Flow";

Flow.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	updatePanelContext: PropTypes.func,
	forwardData: PropTypes.any,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	setIsLoading: PropTypes.func,
	className: PropTypes.string,
	title: PropTypes.string,
	events: PropTypes.object,
}
export default MemoFlow;
