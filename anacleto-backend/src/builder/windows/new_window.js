{
    "window": "new_window",
    "items": [{
        "id": "new_window_header",
        "title": "Crea nuova finestra",
        "type": "form",
        "width": "col-12",
        "background": "bg-primary-reverse",
        "isCard": false,
        "toggleable": false,
        "items": [{
                "colNumber": "col-12 md:col-6",
                "fieldMargin": "mt-4",
                "type": "textInput",
                "hasFloatingLabel": true,
                "value": "",
                "width": "w-full",
                "id": "windowId",
                "disabled": false,
                "label": "Id finestra",
                "events": {
                    "onChange": "function (event, context, value) {\n                                console.log(context.panels.window_header.getRecord())\n                            }"
                }
            },
            {
                "fieldMargin": "mt-4",
                "colNumber": "col-12 md:col-6",
                "type": "textInput",
                "value": "",
                "width": "w-full",
                "hasFloatingLabel": true,
                "id": "name",
                "disabled": false,
                "label": "Nome finestra",
                "events": {
                    "onChange": "function (event, context, value) {\n                                console.log(context.panels.window_header.getRecord())\n                            }"
                }
            },
            {
                "type": "button",
                "colNumber": "col-4 col-offset-8",
                "width": "w-full",
                "id": "create_window",
                "label": "Crea finestra",
                "events": {
                    "onClick": function (event, context) {
                        {


                            var record = context.panels.new_window_header.getRecord()

                            var body = {
                                data: utils._stringifyJsonWithFunctions({
                                    "window": record.windowId,
                                    "windowName": record.name,
                                    "items": []
                                })
                            }

                            utils.callServer({
                                url: "/window",
                                method: "post",
                                //contentType: "text/html",
                                params: {
                                    application: context.destapplication,
                                    "window": record.windowId
                                },
                                data: body
                            }).then(function (response) {
                                if(response.data.success) {
                                    utils.showToast({ severity: 'success', summary: 'Window created', detail: JSON.stringify(response.data), life: 3000 });
                                    context.closeWindow();
                                }else {
                                    utils.showToast({ severity: 'error', summary: 'Window not created', detail: JSON.stringify(response.data), life: 3000 });
                                }
                                
                            }).catch(function (error) {
                                utils.showToast({ severity: 'error', summary: 'Error', detail: "Server error", sticky: true });
                            });

                        }
                    }
                }
            }
        ]
    }]
}