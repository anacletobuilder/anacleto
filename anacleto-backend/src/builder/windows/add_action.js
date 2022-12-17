{
    "window":"add_node",
    components: [{
        "id": "add_node_grid",
        "type": "gridcontainer",
        "title": "Info",
        "width": "col-12",
        "layout": "grid",
        "isCard": true,
        "className": "p-0 pt-2",
        "components": [
            {
                "id": "add_action_info",
                "title": "Action info",
                "dataModel": "Window",
                "type": "form",
                "colNumber": "col-12",
                "background": "bg-primary-reverse",
                "isCard": false,
                "toggleable": false,
                "showTitle": false,
                "components": [
                    {
                        "colNumber": "col-12 md:col-6",
                        "fieldMargin": "mt-2",
                        "type": "textInput",
                        "hasFloatingLabel": true,
                        "value": "",
                        "width": "w-full",
                        "id": "id",
                        "disabled": false,
                        "label": "ID*",
                        "className": "p-inputtext-sm block",
                        "events": {
                            "validate": function (event,context) {
                                var inputData = this.inputData;
                                const value = event.target.value.trim();
                                if (!value || value.length < 1) {
                                    return { success: false, message: "Please specify a valid id" };
                                }else {
                                    var existNode = inputData.rfInstance.getNode(value);
                                    if(existNode) {
                                        return { success: false, message: "Id already set for this window" };
                                    }
                                }
                                return {success:true};
                            }
                        }
                    },
                    {
                        "colNumber": "col-12 md:col-6",
                        "fieldMargin": "mt-2",
                        "type": "textInput",
                        "hasFloatingLabel": true,
                        "value": "",
                        "width": "w-full",
                        "id": "label",
                        "disabled": false,
                        "label": "Label",
                        "className": "p-inputtext-sm block",
                        "events": {
                        "onChange": "function (event, context, value) {\n                                console.log(context.panels.window_header.getRecord())\n                            }"
                        }
                    },
                    {
                        "colNumber": "col-12 md:col-6",
                        "fieldMargin": "mt-2",
                        "type": "textInput",
                        "hasFloatingLabel": true,
                        "value": "",
                        "width": "w-full",
                        "id": "icon",
                        "disabled": false,
                        "label": "Icon",
                        "className": "p-inputtext-sm block",
                        "events": {
                        "onChange": "function (event, context, value) {\n                                console.log(context.panels.window_header.getRecord())\n                            }"
                        }
                    }
                ]
            }
        ],
        "actions":[
            {
                "label": "Save",
                "icon": "pi pi-save",
                "events": {
                    "onClick": function(event,context) {
                        debugger;
                        let defaultControlConfig = utils.getDefaultControlsConfig("action");
                        let inputData = utils.inputData;
                        //NODO
                        let nodes = inputData.rfInstance.getNodes();
                        let edges = inputData.rfInstance.getEdges();
                        let newNode =  JSON.parse(JSON.stringify(inputData.emptyNode));
                        newNode.attributes = defaultControlConfig;
                        if(inputData.rfInstance.getNode(inputData.parentNode).type == "action") {
                            delete newNode.attributes.actions;
                        }
                        newNode.id = context.panels.add_action_info.getRecord().id;
                        newNode.attributes.id = newNode.id;
                        newNode.attributes.label = context.panels.add_action_info.getRecord().label;
                        newNode.attributes.icon = context.panels.add_action_info.getRecord().icon;
                        newNode.ancestorNode = inputData.parentNode;
                        const getAddNodePos = function(nodes,parentNode) {
                            return nodes.findIndex(n => {return n.id === parentNode + "_ADDACTION"});
                        }
                        let addNodePos = getAddNodePos(nodes,inputData.parentNode);
                        newNode.itemPosition = nodes[addNodePos].itemPosition || 0;
                        nodes[addNodePos].itemPosition++;
    
                        newNode.data = { "label": newNode.id, "attributeType":"action"}
                            newNode.type = "action";
                            if(addNodePos > -1) {
                                nodes.splice(addNodePos,0,newNode);
                            }else {
                                nodes.push(newNode);
                            }
                            
                            //RAMO
                            var edge = {
                                "id": inputData.parentNode + "|" + newNode.id, 
                                "source": inputData.parentNode, 
                                "target": newNode.id, 
                                "type": "smoothstep"
                            }
                            edges.push(edge);
    
                            if(newNode.attributes.events) {
                                let addEventNode = JSON.parse(JSON.stringify(inputData.emptyNode))
                                Object.assign(
                                    addEventNode,
                                    {
                                        "data" : {
                                            "label": "Aggiungi evento",
                                            "attributeType": ""
                                          },
                                        "id": newNode.id + "_ADDEVENT",
                                        "type": "addeventnode",
                                        "attributes":{
                                            "id": newNode.id + "_ADDEVENT",
                                            "title": "Aggiungi",
                                            "nodeType": "addeventnode"
                                          }
                                    })
                                nodes.push(addEventNode);
                                edges.push({
                                    "id": newNode.id + "|" + addEventNode.id, 
                                    "source": newNode.id, 
                                    "target": addEventNode.id, 
                                    "type": "smoothstep"
                                })
                            }
    
                            const windowId = utils.getSearchParam("window");
                            const windowMap = inputData.convertFlowToMap(windowId,nodes)
                            inputData.convertMapToFlow(windowMap);
                            //inputData.rfInstance.fitView();
                            context.closeWindow();
                    }
                }
            }
        ]
      }]
}