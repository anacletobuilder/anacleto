{
    "window": "manage_columns",
    "className": "flex-column w-full",
    components: [{
            "id": "manage_columns_container",
            "type": "gridcontainer",
            "title": "Query",
            "width": "col-12",
            "layout": "grid",
            "isCard": true,
            "className": "flex-column h-full",
            "components": [{
                "id": "columns_query",
                "title": "Code",
                "type": "form",
                "showTitle": false,
                "toggleable":true,
                "className": "no-padding",
                "components": [{
                    "id": "db",
                    "fieldColumn": "col-4 md:col-6",
                    "fieldMargin": "m-0 mt-2",
                    "type": "textInput",
                    "hasFloatingLabel": true,
                    "width": "w-full",
                    "className": "col-12",
                    "disabled": false,
                    "label": "Database"
                },
                {
                    "type": "codeEditor",
                    "colNumber": "col-12",
                    "id": "sql",
                    "language":"sql",
                    "className": "flex-1 flex border-1 surface-border stretch h-5rem m-0 mt-2",
                    "value": "",
                    "width": "w-full",
                }],
                "events": {
                    "afterRender": function (event, context) {}
                }
            }],
            "actions": [{
                "id": "run_button",
                "label": "Run Query",
                "icon": "pi pi-save",
                "events": {
                    "onClick": function (event, context) {
                        debugger;

                        const columns_query = context.panels.columns_query.getRecord();
                        const queryArgs = {
                            db: columns_query.db,
                            sql: columns_query.sql,
                            timeout:500
                        }

                        const res = utils.executeServerScript(
                            {
                                script : `code/execute_query`,
                                body:JSON.stringify({queryArgs: queryArgs})
                            })
                            .then(res => {
                                let columns = [];
                                const compileColumns = function(queryResultRow) {
                                    for(var attr in queryResultRow) {
                                        if (queryResultRow[attr] && typeof queryResultRow[attr] == "object") {
                                            compileColumns(queryResultRow[attr]);
                                        }else {
                                            columns.push({
                                            fieldName: attr,
                                            header: attr,
                                            sortable:false,
                                            model: ""
                                            })
                                        }
                                    }
                                }
                                compileColumns(res.data[0]);

                                const colItems = columns.map(item => {
                                    return {
                                        id: `columns_${item.fieldName}`,
                                        type: "textInput",
                                        colNumber: "",
                                        fieldClassName: "",
                                        className: "col-12",
                                        value: JSON.stringify(item),
                                        hasFloatingLabel: true,
                                        disabled: false,
                                        label: `${item.fieldName}`,
                                        events: {},
                                    }
                                })
                                context.panels.manage_columns.setItems(colItems);
                            });
                    }
                }
            }]
        },
        {
            "id": "manage_columns",
            "type": "gridcontainer",
            "width": "col-12",
            "layout": "grid",
            "isCard": true,
            "className": "flex-column h-full",
            "components": [{
                "id": "column_1",
                "type": "form",
                "width": "col-12",
                "layout": "grid",
                "isCard": true,
                "toggleable": true,
                "title": "Colonna1",
                "items" : [
                    {
                        "id": "column_1_position",
                        "type": "numberInput",
                        "className": "col-12 md:col-6 lg:col-3",
                        "disabled": true,
                        "value": 1,
                        "hasFloatingLabel":true,
                        "label": "Column Position"
                    },{
                        "id": "column_1_id",
                        "type": "textInput",
                        "className": "col-12 md:col-6 lg:col-3",
                        "disabled": true,
                        "value": "idColonna1",
                        "hasFloatingLabel":true,
                        "label": "Column Name"
                    },
                    {
                        "id": "column_1_visible",
                        "type": "checkbox",
                        "className": "",
                        "colNumber":"col-12 md:col-6 lg:col-3",
                        "disabled": false,
                        "value": true,
                        "hasFloatingLabel":true,
                        "label": "Visible"
                    },
                    {
                        "id": "column_1_sortable",
                        "type": "checkbox",
                        "className": "",
                        "colNumber":"col-12 md:col-6 lg:col-3",
                        "disabled": false,
                        "value": true,
                        "hasFloatingLabel":true,
                        "label": "Sortable"
                    },
                    {
                        "id": "column_1_desc",
                        "type": "textInput",
                        "className": "col-12 md:col-6",
                        "disabled": false,
                        "value": "descriptionHeader",
                        "hasFloatingLabel":true,
                        "label": "Description"
                    }
                ],
                "actions": [{
                    "id": "del_column_1",
                    "label": "",
                    "icon": "pi pi-trash",
                    "className":"p-button-danger"
                }]
            }],
            "actions": [{
                "id": "save_button",
                "label": "Save",
                "icon": "pi pi-save",
                "events": {
                    "onClick": function (event, context) {}
                }
            }]
        }
    ]
}