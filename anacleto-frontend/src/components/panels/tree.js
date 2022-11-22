import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { Tree as PrimeTree } from "primereact/tree";
import axios from "axios";
import { ContextMenu } from "primereact/contextmenu";
import { getToken } from "../../login/loginUtils";
import PropTypes from "prop-types";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { defaultMemoizeFunction } from "../../utils/utils";
/**
 * Pannello tab
 * @param {Object} props: properties
 * @param {Object} props.context: struttura della finestra
 * @returns
 */
function Tree({ id, context, panelContext, ...props }) {
	const application = context.application;
	const destApplication = context.destApplication;
	const tenant = context.tenant;

	const [nodes, setNodes] = useState([]);
	const [selectedNodeKey, setSelectedNodeKey] = useState(null);
	const [expandedKeys, setExpandedKeys] = useState({});
	const [menu, setMenu] = useState([]);
	const cm = useRef(null);
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);

	useEffect(
		() => {
			updatePanelContext({
				id,
				setNodes,
				load: function (_params) {
					//TODO gestire parametri
					fetchData();
				},
			});

			return () => {
				console.log("Tree component is unmounting");
			};
		},
		[]
	);

	useEffect(() => {
		updatePanelContext({
			id,
			nodes: nodes,
		});
	}, [nodes]);

	const fetchData = () => {
		console.log("Tree component fetchData");
		if (!props.store) {
			window.utils.showToast({
				severity: "error",
				summary: "Error",
				detail: "Missing grid store",
				sticky: true,
			});
			return;
		}

		getToken()
		.then((token) => {
			return axios.get(
				`${process.env.REACT_APP_BACKEND_HOST}/processScript?panel=${id}&script=${props.store}`,
				{
					timeout: 60000,
					headers: {
						Authorization: token,
						application: application,
						destapplication: destApplication,
						tenant: tenant,
					},
				}
			);
		})
		.then((res) => {
			setNodes(res.data);
		})
		.catch((e) => {
			window.utils.showToast({
				severity: "error",
				summary: "Error",
				detail: "Server error, can't load tree",
				sticky: true,
			});
		});
	};
	
	const onExpand = useCallback((_event) => {
		if (props.events?.onExpand) {
			props.events?.onExpand.bind({ panel: props, context, panelsContext, updatePanelContext, ...panelContext })(_event);
		}
	}, [props.events, context, panelContext, panelsContext]);
	const onCollapse = useCallback((_event) => {
		if (props.events?.onCollapse) {
			props.events.events.onCollapse.bind({ panel: props, context, panelsContext, updatePanelContext, ...panelContext })(_event);
		}
	}, [props.events, context, panelContext, panelsContext]);
	const onSelect = useCallback((_event) => {
		if (props.events?.onSelect) {
			props.events.onSelect.bind({ panel: props, context, panelsContext, updatePanelContext, ...panelContext })(_event);
		}
	}, [props.events, context, panelContext, panelsContext]);
	const onUnselect = useCallback((_event) => {
		if (props.events.onUnselect) {
			props.events?.onUnselect.bind({ panel: props, context, panelsContext, updatePanelContext, ...panelContext })(_event);
		}
	}, [props.events, context, panelContext, panelsContext]);

	const onContextMenu = useCallback((_event) => {
		let contextMenuItem = [];
		if (props.events.onContextMenu) {
			contextMenuItem = props.events.onContextMenu.bind({ panel: props, context, panelsContext, updatePanelContext, ...panelContext })(_event);
		}

		if (contextMenuItem && contextMenuItem.length > 0) {
			setMenu(contextMenuItem);

			cm.current.show(_event.originalEvent);
		}
	}, [props.events, context, panelContext, panelsContext]);

	const onContextMenuHide = useCallback(() => setSelectedNodeKey(null), []);
	const onToggle = useCallback((e) => setExpandedKeys(e.value), []);
	const onSelectionChange = useCallback((e) => setSelectedNodeKey(e.value), []);
	const onContextMenuSelectionChange = useCallback((e) => setSelectedNodeKey(e.value), []);
	
	if(panelContext._status !== PANEL_STATUS_READY) return;

	return (
		<div className="anacleto-tree-container">
			<ContextMenu
				model={menu}
				ref={cm}
				onHide={onContextMenuHide}
			/>

			<PrimeTree
				value={nodes}
				expandedKeys={expandedKeys}
				onToggle={onToggle}
				selectionMode="single"
				selectionKeys={selectedNodeKey}
				filter={props.filterMode ? true : false}
				filterMode={props.filterMode} //lenient / strict
				onSelectionChange={onSelectionChange}
				onExpand={onExpand}
				onCollapse={onCollapse}
				onSelect={onSelect}
				onUnselect={onUnselect}
				onContextMenu={onContextMenu}
				contextMenuSelectionKey={selectedNodeKey}
				onContextMenuSelectionChange={onContextMenuSelectionChange}
			/>
		</div>
	);
}

const MemoTree = React.memo(Tree, (prev, next) => {
	return defaultMemoizeFunction(Tree.propTypes, prev, next);
});
MemoTree.displayName = "Tree";
Tree.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	updatePanelContext: PropTypes.func,
	setIsLoading: PropTypes.func,
	className: PropTypes.string,
	isCard: PropTypes.bool,
	toggleable: PropTypes.bool,
	events: PropTypes.object,
	title: PropTypes.string,
	panelBaseMethods: PropTypes.object,
	store: PropTypes.string,
	filterMode: PropTypes.string
}
export default MemoTree;