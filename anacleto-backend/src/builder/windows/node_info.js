{
	"window": "node_info",
	"items": [{
		"id": "window_node_container",
		"type": "gridcontainer",
		"title": "",
		"layout": "flex",
		"className" : "flex-column",
		"items": [
			{
				"id": "windows_node_info",
				"title": "Informazioni",
				"type": "form",
				"width": "col-12",
				"background": "bg-primary-reverse",
				"isCard": false,
				"toggleable": false,
				"className": "flex-grow-2 flex-shrink-2 stretch",
				"events": {
					afterRender: function (event, context) {
						var nodeInfo = utils.getInputData().node;
						var renderItems = [];
						var attributeRecord = {}
						
						const isAttrDisabled = function (type) {
							return ["id", "type"].indexOf(type) > -1;
						}
						
						for (attr in nodeInfo.attributes) {
							if (attr == "items" || attr == "events") {
								continue;
							}
							
							if (typeof nodeInfo.attributes[attr] == "boolean") {
								renderItems.push({
									"colNumber": "col-12",
									"fieldMargin": "mt-2",
									"type": "checkbox",
									"hasFloatingLabel": false,
									"value": "",
									"width": "w-full",
									"id": attr,
									"disabled": isAttrDisabled(attr),
									"label": attr,
									onChange: function (event, context, value) {
										utils.getInputData().node.attributes[event.target.id] = event.target.checked;
									}
								});
							} else {
								renderItems.push({
									"colNumber": "col-12",
									"fieldMargin": "mt-2",
									"type": "textInput",
									"hasFloatingLabel": true,
									"value": JSON.stringify(nodeInfo.attributes[attr]),
									"width": "w-full",
									"id": attr,
									"disabled": isAttrDisabled(attr),
									"label": attr,
									"className": "p-inputtext-sm block",
									"events": {
										"onChange": function (event, context, value) {
											utils.getInputData().node.attributes[event.target.id] = event.target.value;
										}
									}
								});
							}
							
							
							attributeRecord[attr] = nodeInfo.attributes[attr];
						}
						/* Bottone per aggiungere nuove proprietà?
						renderItems.push({
							"type": "button",
							"className": "col-12 h-3rem",
							"fieldClassName":"p-button",
							"icon":"pi pi-plus",
							"label": "Aggiungi proprietà",
							onClick: function(event, context){
								utils.openWindow({
									window : '/add_property',
									type:'modal',
									inputData: nodeInfo
								});
							}
						});*/
						context.panels.windows_node_info.setItems(renderItems);
						context.panels.windows_node_info.setRecord(attributeRecord);
					}
				},
				"items": []
			},
			{
				"id": "windows_node_footer",
				"type": "form",
				"width": "col-12",
				"background": "bg-primary-reverse",
				"isCard": false,
				"toggleable": false,
				"className": "flex-grow-1 flex-shrink-1",
				"items": [{
					"id": "windows_node_footer_delete",
					"type": "button",
					"className": "col-12 h-3rem",
					"fieldClassName":"p-button-outlined p-button-danger",
					"icon":"pi pi-trash",
					"label": "DELETE",
					"events" : {
						"onClick": function(event,context) {
							
							utils.showConfirmDialog({
								message: 'Do you want to delete this node?',
								header: 'Delete Confirmation',
								icon: 'pi pi-info-circle',
								acceptClassName: 'p-button-danger',
								accept: function () {
									var inputData = utils.getInputData();
									var currentNode = inputData.node;
									var instance = inputData.rfInstance;
									var nodes = instance.getNodes();
									var edges = instance.getEdges();
									//Al click devo eliminare tutti i  NODI e i rami che hanno collegamenti con il nodo che sto eliminando
									const removeChildNodes = function (parentNode) {
										console.log("removeChildNodes",parentNode);
										var childNodes = nodes.filter(el => el.ancestorNode == parentNode);
										console.log("removeChildNodes: childNodes",childNodes);
										if(childNodes.length > 0) {
											for(var i = 0; i < childNodes.length; i++) {
												var nIndex = nodes.findIndex(el => el.id == childNodes[i].id);
												if(nIndex > -1) {
													nodes.splice(nIndex,1);
													removeChildNodes(childNodes[i].id);
													filterEdges(childNodes[i].id);
												}
											}
										} 
									}
									const filterEdges = function(nodeId) {
										console.log("filterEdges",nodeId);
										edges = edges.filter(el => el.target != nodeId);
									}
									
									var currentNodeIndex = nodes.findIndex(el => el.id == currentNode.id);
									if(currentNodeIndex > -1) {
										nodes.splice(currentNodeIndex,1);
										filterEdges(currentNode.id);
										removeChildNodes(currentNode.id);
										
										//Sistemo le posizioni
										var siblingNodes = nodes.filter(el => el.ancestorNode == currentNode.ancestorNode);
										console.log(siblingNodes);
										for(var i = 0; i < siblingNodes.length; i++) {
											var siblingIndex = nodes.findIndex(el => el.id == siblingNodes[i].id);
											if(nodes[siblingIndex].itemPosition > currentNode.itemPosition) {
												nodes[siblingIndex].itemPosition--;
											}
										}
									}
									const windowId = utils.getSearchParam("window");
									const windowMap = inputData.convertFlowToMap(windowId,nodes)
									inputData.convertMapToFlow(windowMap);
									context.closeWindow();
								},
								reject: function () { }
							});
						}
					}
				}]
			}
	]
}]
}