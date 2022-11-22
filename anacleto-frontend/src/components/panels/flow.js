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

const initNodes = [];
const initEdges = [];

function Flow(props) {
	const destApplication = useSelector(selectDestApplication);

	const { updatePanelContext } = useContext(PanelsContext);
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
			obj.items = [];
			for (var i in itemChilds) {
				obj.items.push(convertFlowToMap(itemChilds[i].id, nodeArr));
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
				context: props.context,
			};
			for (var attr in obj) {
				if (attr == "itemPosition") {
					node.itemPosition = obj[attr];
				} else if (
					attr == "items" ||
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
				!obj.items &&
				itm.id?.indexOf("ADDNEWITM") < 0 &&
				itm.id?.indexOf("_EVENT_") < 0 &&
				itm.id?.indexOf("_ADDEVENT") < 0
			) {
				//Se non ho items non devo avere possibilità di aggiungere figli
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

			if (obj.items) {
				for (var i = 0; i < obj.items.length; i++) {
					var currItm = obj.items[i];
					currItm.itemPosition = siblingPosition;
					siblingPosition++;
					composeNodesAndEdges(currItm, node.id);
				}
				composeNodesAndEdges(
					{
						id: node.id + "_ADDNEWITM",
						title: "Add object",
						nodeType: "addnode",
						itemPosition: obj.items.length,
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
			id: props.id,
			flowToMap: convertFlowToMap,
			mapToFlow: convertMapToFlow,
		});
	}, [])

	useEffect(() => {
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
		if (node.type == "addnode") {
			//alert("Aggiungi controllo");
			var parentNode = node.id.replace("_ADDNEWITM", "");
			window.utils.openWindow({
				window: "add_node",
				type: "modal",
				settings: {
					header: `Add node to: ${parentNode}`,
				},
				inputData: {
					rfInstance: rfInstance,
					parentNode: parentNode,
					convertMapToFlow: convertMapToFlow,
					convertFlowToMap: convertFlowToMap,
					emptyNode: {
						position: { x: 0, y: 0 },
						draggable: false,
						context: props.context,
					},
				},
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
				inputData: {
					rfInstance: rfInstance,
					parentNode: parentNode,
					convertMapToFlow: convertMapToFlow,
					convertFlowToMap: convertFlowToMap,
					emptyNode: {
						position: { x: 0, y: 0 },
						draggable: false,
						context: props.context,
					},
				},
			});
		} else if (node.type == "eventnode") {
			window.utils.openWindow({
				window: "add_event",
				type: "modal",
				settings: {
					header: `Modify event`,
					maximizable: true,
					contentClassName: "flex-column",
				},
				inputData: {
					node: node,
					rfInstance: rfInstance,
					convertMapToFlow: convertMapToFlow,
					convertFlowToMap: convertFlowToMap,
				},
			});
		} else if (node.type == "addaction") {
			var parentNode = node.id.replace("_ADDACTION", "");
			window.utils.openWindow({
				window: "add_action",
				type: "modal",
				settings: {
					header: `Add action to: ${parentNode}`,
				},
				inputData: {
					rfInstance: rfInstance,
					parentNode: parentNode,
					convertMapToFlow: convertMapToFlow,
					convertFlowToMap: convertFlowToMap,
					emptyNode: {
						position: { x: 0, y: 0 },
						draggable: false,
						context: props.context,
					},
				},
			});
		} else {
			//Apro la sidebar
			window.utils.openWindow({
				window: "node_info",
				type: "sidebar",
				settings: {
					header: "Information",
					className: "p-sidebar-sm",
					position: "right",
					style: {
						height: "calc(100% - 5rem)",
						marginTop: "5rem",
					},
				},
				inputData: {
					node: node,
					rfInstance: rfInstance,
					setNodes: setNodes,
					setEdges: setEdges,
					convertMapToFlow: convertMapToFlow,
					convertFlowToMap: convertFlowToMap,
				},
			});
		}
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
				inputData: {
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
			<div className="flex-auto">
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
Flow.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	updatePanelContext: PropTypes.func,
	setIsLoading: PropTypes.func,
	className: PropTypes.string,
	isCard: PropTypes.bool,
	title: PropTypes.string,
	panelBaseMethods: PropTypes.object,
}
export default Flow;
