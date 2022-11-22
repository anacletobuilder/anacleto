{
	"window": "add_node",
	"className": "flex-column w-full",
	items: [{
		"id": "add_event_container",
		"type": "gridcontainer",
		"title": "Info",
		"width": "col-12",
		"layout": "grid",
		"isCard": true,
		"className": "flex-column h-full",
		"items": [{
			"id": "add_event_info",
			"title": "Event type",
			"dataModel": "Window",
			"colNumber": "col-12",
			"type": "form",
			"width": "col-12",
			"background": "bg-primary-reverse",
			"isCard": false,
			"toggleable": false,
			"showTitle": false,
			"items": [{
				"id": "eventType",
				"fieldColumn": "col-4 md:col-6",
				"fieldMargin": "m-0 mt-2",
				"type": "dropdown",
				"hasFloatingLabel": false,
				"width": "w-full",
				"className": "col-12",
				"optionLabel": "description",
				"optionValue": "code",
				"options": [],
				"disabled": false,
				"placeholder": "Select an event type",
				"label": "Event type"
			}],
			"events" : {
				"afterRender" : function(event,context) {
					debugger;
					var inputData = utils.getInputData();
					var parentNode;
					if(inputData.node) {
						parentNode = inputData.rfInstance.getNode(inputData.node.ancestorNode);
						
						context.panels.add_event_info.setRecord(
							{eventType:inputData.node.attributes.eventType});
						}else {
							parentNode = inputData.rfInstance.getNode(inputData.parentNode);
						}
						
						context.panels.add_event_info.items.eventType.options = utils.getDefaultControlsConfig(parentNode.attributes.type,"events");
					}
				}
			},
			{
				"id": "add_event_code",
				"title": "Code",
				"type": "form",
				"showTitle":false,
				"items": [
					{
						"type": "codeEditor",
						"colNumber": "col-12",
						"id": "source",
						"className": "flex-1 flex border-1 surface-border h-full m-0",
						"value": "",
						"width": "w-full",
					}
				],
				"events": {
					"afterRender": function(event,context) {
						var inputData = utils.getInputData();
						if(inputData.node) {
							var sourceValue = inputData.node.attributes.value || "";
							sourceValue = sourceValue.replace("function (event, context) {","");
							sourceValue = sourceValue.substr(0, sourceValue.length - 1);
							context.panels.add_event_code.setRecord({
								source: sourceValue
							})
						}
					}
				}
			}
		],
		"actions": [{
			"id": "save_button",
			"label": "Save",
			"icon": "pi pi-save",
			"events" : {
				"onClick": function (event, context) {
					context.panels.add_event_container.setIsToolbarLoading(true);
					var inputData = utils.getInputData();
					if(inputData.node) {
						//Modifica di un evento
						var functionStr = context.panels.add_event_code.getRecord().source;
						inputData.node.attributes.value = `function (event, context) {${functionStr}}`;
						context.panels.add_event_container.setIsToolbarLoading(false);
						context.closeWindow();
					}else {
						let nodes = inputData.rfInstance.getNodes();
						let edges = inputData.rfInstance.getEdges();
						var eventType = context.panels.add_event_info.getRecord().eventType;
						if(eventType) {
							var functionStr = context.panels.add_event_code.getRecord().source;
							//{id:node.id + "_EVENT_" + e,"title":e,"type":"EVENT", "nodeType":"eventnode","value":obj.events[e],"itemPosition": eventsPosition}
							var eventNode = JSON.parse(JSON.stringify(inputData.emptyNode));
							var eventId = inputData.parentNode + "_EVENT_" + eventType;
							Object.assign(
								eventNode,
								{
									"data" : {
										"label": eventType,
										"attributeType": "EVENT"
									},
									"id": eventId,
									"type":"eventnode",
									"ancestorNode": inputData.parentNode,
									"attributes":{
										"id": eventId,
										"type": "EVENT",
										"title": eventType,
										"eventType": eventType,
										"value": `function (event, context) {${functionStr}}`
									}
								})
								const getItmSiblingPos = function(nodes,parentNode) {
									return nodes.findIndex(n => n.id === parentNode + "_ADDEVENT");
								}
								let addItmSiblingPos = getItmSiblingPos(nodes,inputData.parentNode);
								if(addItmSiblingPos > -1) {
									eventNode.itemPosition = nodes[addItmSiblingPos].itemPosition || 0;
									nodes[addItmSiblingPos].itemPosition++;
								}else {
									eventNode.itemPosition = 0;
								}
								nodes.push(eventNode);
								
								var edge = {
									"id": inputData.parentNode + "|" + eventId, 
									"source": inputData.parentNode, 
									"target": eventId, 
									"type": "smoothstep"
								}
								edges.push(edge);
								
								const windowId = utils.getSearchParam("window");
								const windowMap = inputData.convertFlowToMap(windowId,nodes)
								inputData.convertMapToFlow(windowMap);
							}
							context.panels.add_event_container.setIsToolbarLoading(false);
							context.closeWindow();
						}
					}
				},
				"actions": [{
					"id":"delete_button",
					"label": "Delete",
					"icon": "pi pi-trash",
					"events": {
						"onClick":function (event, context) {
							debugger;
							let inputData = utils.getInputData();
							if(inputData.node) {
								var nodes = inputData.rfInstance.getNodes();
								//Trovo il ramo che arriva al nodo che devo rimuovere
								var nodes = nodes.filter((el) => {return el.id != inputData.node.id})
								const windowId = utils.getSearchParam("window");
								const windowMap = inputData.convertFlowToMap(windowId,nodes)
								inputData.convertMapToFlow(windowMap);
							}
							context.closeWindow();
						}
					}
				}]
			}]
		}]
	}