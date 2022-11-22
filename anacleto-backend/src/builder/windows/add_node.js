{
    "window":"add_node",
    items: [{
        "id": "add_node_grid",
        "type": "gridcontainer",
        "title": "Add info",
        "width": "col-12",
        "layout": "grid",
        "isCard": true,
        "className": "p-0 pt-2",
        "items": [
            {
                "id": "add_node_info",
                "title": "Control info",
                "dataModel": "Window",
                "type": "form",
                "colNumber": "col-12",
                "background": "bg-primary-reverse",
                "isCard": false,
                "toggleable": false,
                "showTitle": false,
                "items": [{
                    "colNumber": "col-12 md:col-6",
                    "fieldMargin": "mt-2",
                    "type": "textInput",
                    "hasFloatingLabel": true,
                    "value": "",
                    "width": "w-full",
                    "id": "controlId",
                    "disabled": false,
                    "label": "ID*",
                    "className": "p-inputtext-sm block",
                    "events": {
                        "validate": function (event,context) {
                            var inputData = utils.getInputData(); 
                            const value = event.target.value;
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
                  }]
            },
            {
                "id": "add_node_choose_type",
                "title": "Control type",
                "type": "form",
                "colNumber": "col-12",
                "background": "bg-primary-reverse",
                "isCard": false,
                "toggleable": false,
                "showTitle": true,
                "items": [],
                "events": {
                    afterRender: function(event, context){
                        var nodeType  = utils.getControlsList(); //["WINDOW","FORM","GRID"];

                        var itemTypes = [];
                        for(var i = 0; i < nodeType.length;i++) {
                            itemTypes.push({
                                "colNumber":"col-3",
                                "id": nodeType[i],
                                "type": "toggleButton",
                                "onLabel": nodeType[i].toUpperCase(),
                                "offLabel": nodeType[i].toUpperCase(),
                                "className": "col-12 p-button-sm p-button-outlined h-2rem",
                                "checked": false,
                                "tabIndex": i,
                                "iconPos": "right",
                                "events": {
                                    "onChange": function (event,context) {
                                        debugger;
                                        var typeRecord = context.panels.add_node_choose_type.getRecord();
                                        var typeSelected = event.target.id;
                                        if(typeRecord.selectedType && typeSelected != typeRecord.selectedType) {
                                            context.panels.add_node_choose_type.items[typeRecord.selectedType].setChecked(false);
                                        }
                                        if(event.value) {
                                            context.panels.add_node_choose_type.setRecord({"selectedType": typeSelected});
                                        }else {
                                            context.panels.add_node_choose_type.setRecord({"selectedType": null})
                                        }
                                    },
                                    "onClick": "function (event, context) {\n                                alert(JSON.stringify(context.panels.window_header.getRecord()));\n                            }"
                                }
                            });
                        }
                        context.panels.add_node_choose_type.setItems(itemTypes);
                        context.panels.add_node_choose_type.setRecord({"selectedType": null})
                    }
                }
            }
        ],
        "actions":[
            {
                "label": "Save",
                "icon": "pi pi-save",
                "events" : {
                    "onClick": function(event,context) {
                        debugger;
                        if(context.panels.add_node_choose_type.getRecord().selectedType) {
                            let selectedType = context.panels.add_node_choose_type.getRecord().selectedType;
                            let defaultControlConfig = utils.getDefaultControlsConfig(selectedType);
                            let inputData = utils.inputData;
                            //NODO
                            let nodes = inputData.rfInstance.getNodes();
                            let edges = inputData.rfInstance.getEdges();
                            let newNode =  JSON.parse(JSON.stringify(inputData.emptyNode));
                            newNode.attributes = defaultControlConfig;
                            newNode.id = context.panels.add_node_info.getRecord().controlId;
                            newNode.attributes.id = newNode.id;
                            newNode.ancestorNode = inputData.parentNode;
                            debugger;
                            const getItmSiblingPos = function(nodes,parentNode) {
                                return nodes.findIndex(n => {return n.id === parentNode + "_ADDNEWITM"});
                            }
                            let addItmSiblingPos = getItmSiblingPos(nodes,inputData.parentNode);
                            if(addItmSiblingPos > -1) {
                                newNode.itemPosition = nodes[addItmSiblingPos].itemPosition || 0;
                                nodes[addItmSiblingPos].itemPosition++;
    
                                //Devo aumentare anche la posizione di tutti gli eventi e di tutti i bottoni
                                siblingNodes = nodes.filter(el => {return el.ancestorNode == inputData.parentNode && (el.type != "itemnode" && el.type !="addnode")});
                                for (var i in siblingNodes) {
                                    var nodeIndex = nodes.findIndex(el => {return el.id == siblingNodes[i].id});
                                    if(nodeIndex > -1) {
                                        nodes[nodeIndex].itemPosition++;
                                    }
                                }
                            }else {
                                newNode.itemPosition = 0;
                            }
                            
                            
                            newNode.data = { "label": newNode.id, "attributeType":selectedType}
                            newNode.type = "itemnode";
                            if(addItmSiblingPos > -1) {
                                nodes.splice(addItmSiblingPos,0,newNode);
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
                            var childPos = addItmSiblingPos;
                            if(newNode.attributes.items) {
                                //Aggiungi item
                                let addItmNode = JSON.parse(JSON.stringify(inputData.emptyNode));
                                Object.assign(
                                    addItmNode,
                                    {
                                        "data" : {
                                            "label": "Aggiungi oggetto",
                                            "attributeType": ""
                                          },
                                        "id": newNode.id + "_ADDNEWITM",
                                        "type": "addnode",
                                        "attributes":{
                                            "id": newNode.id + "_ADDNEWITM",
                                            "title": "Aggiungi",
                                            "nodeType": "addnode"
                                          }
                                    })
                                if(childPos && childPos > -1) {
                                    nodes.splice(childPos + 1,0,addItmNode);
                                    childPos++;
                                }else {
                                    nodes.push(addItmNode);
                                }
                                edges.push({
                                    "id": newNode.id + "|" + addItmNode.id, 
                                    "source": newNode.id, 
                                    "target": addItmNode.id, 
                                    "type": "smoothstep"
                                })
                                //Aggiungi events
                            }
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
                                if(childPos && childPos > -1) {
                                    nodes.splice(childPos + 1,0,addEventNode);
                                    childPos++;
                                }else {
                                    nodes.push(addEventNode);
                                }
                                edges.push({
                                    "id": newNode.id + "|" + addEventNode.id, 
                                    "source": newNode.id, 
                                    "target": addEventNode.id, 
                                    "type": "smoothstep"
                                })
                            }
                            if(newNode.attributes.actions) {
                                //Aggiungi item
                                let addToolbarItmNode = JSON.parse(JSON.stringify(inputData.emptyNode));
                                Object.assign(
                                    addToolbarItmNode,
                                    {
                                        "data" : {
                                            "label": 'test5_form_ADDTOOLBARBTN', 
                                            "attributeType": 'TOOLBAR BUTTON'
                                        },
                                        "id": newNode.id + "_ADDTOOLBARBTN",
                                        "type": "addnode",
                                        "attributes":{
                                            "id": newNode.id + "_ADDTOOLBARBTN",
                                            "title": "",
                                            "nodeType": "addactions"
                                          }
                                    })
                                if(childPos && childPos > -1) {
                                    nodes.splice(childPos + 1,0,addToolbarItmNode);
                                    childPos++;
                                }else {
                                    nodes.push(addToolbarItmNode);
                                }
                                edges.push({
                                    "id": newNode.id + "|" + addToolbarItmNode.id, 
                                    "source": newNode.id, 
                                    "target": addToolbarItmNode.id, 
                                    "type": "smoothstep"
                                })
                                //Aggiungi events
                            }
    
                            const windowId = utils.getSearchParam("window");
                            const windowMap = inputData.convertFlowToMap(windowId,nodes)
                            inputData.convertMapToFlow(windowMap);
                            //inputData.rfInstance.fitView();
                            context.closeWindow();
                        }
                        
                    }
                }
            }
        ]
      }]
}