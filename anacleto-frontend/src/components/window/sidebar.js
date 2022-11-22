import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams, createSearchParams } from 'react-router-dom'
import axios from 'axios';
import MemoGridContainer from "../panels/gridContainer";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import utils from "../../utils/utils";
import { getToken } from "../../login/loginUtils";

function Sidebar(props) {
    const [sidebarMetadata, setSidebarMetadata] = useState(null);
    const navigate = useNavigate();


    /**
     * metadati della finestra che arrivano dal server e servono a renderizzarla
     */
    const [loadError, setLoadError] = useState(false);
    const sidebarScript = document.createElement('script');

    useEffect(() => {
        document.body.appendChild(sidebarScript);

        //li risetto altrimenti destapplication è sempre null anche se in creazione era stato passato
        //non ho ben capito il perchè ma va beh
        setContext(Object.assign(context, {
            tenant: props.tenant,
            application: props.metadata.application,
            destapplication: props.destApplication
        }));


        //sovrascrivo la function navigate in modo da mantere i parametri base
        const _navigate = function (_window, _options) {
            //imposto lo stato di default
            const defaultSearchParams = {
                application: props.metadata.application,
                destapplication: props.destApplication
            }
            const searchParamstmp = Object.assign(defaultSearchParams, _options.searchParams);

            navigate({
                pathname: _window,
                search: createSearchParams(searchParamstmp).toString()
            });
        }

        fetchData(props.settings.windowId);


        return () => {
            console.log('Sidebar component is unmounting');
            document.body.removeChild(sidebarScript);
        };
    }, [props.tenant, props.application, props.destApplication, props.settings.windowId]);

    const fetchData = (windowId) => {
        if (windowId) {
            getToken()
                .then(token => {
                    return axios.get(`${process.env.REACT_APP_BACKEND_HOST}/window?window=${windowId}`, {
                        timeout: 60000,
                        headers: {
                            Authorization: token,
                            application: props.metadata.application,
                            tenant: props.tenant,
                        },
                    });
                })
                .then(res => {
                    sidebarScript.innerHTML = res.data;
                    let windowData = document.getWindowData(navigate);

                    windowData = window.utils._parseJsonWithFunctions(window.utils._stringifyJsonWithFunctions(windowData));

                    setSidebarMetadata(windowData);
                    setLoadError(false);
                }).catch(e => {
                    console.error(e);
                    setLoadError(true);
                });
        } else {
            setSidebarMetadata(null);
        }

    };

    const onHide = () => {
        {
            window.utils.setInputData({});
            props.setSidebarSettings({ visible: false, position: props.settings.position || "right", style: props.settings.style })
        }
    }
    const [context, setContext] = useState({
        tenant: props.tenant,
        application: props.metadata.application,
        destapplication: props.destApplication,
        windowId: props.windowId,
        panels: {}, //i pannelli si aggiungono man mano che vengono creati
        userCredential: props.userCredential,
        closeWindow: onHide
    });



    return <PrimeSidebar
        id={props.settings.id}
        style={props.settings.style}
        className={props.settings.className}
        maskStyle={props.settings.maskStyle}
        maskClassName={props.settings.maskClassName}
        visible={props.settings.visible || false}
        position={props.settings.position || "right"}
        fullScreen={props.settings.fullScreen}
        blockScroll={props.settings.blockScroll}
        baseZIndex={props.settings.baseZIndex}
        dismissable={props.settings.dismissable}
        showCloseIcon={props.settings.showCloseIcon}
        ariaCloseLabel={props.settings.ariaCloseLabel}
        icons={props.settings.icons}
        modal={props.settings.modal}
        appendTo={props.settings.appendTo}
        closeOnEscape={props.settings.closeOnEscape}
        transitionOptions={props.settings.transitionOptions}
        onHide={onHide}
    >
        {sidebarMetadata ?
            <div className="layout-main">
                <h3>{props.settings.header ? props.settings.header : null}</h3>

                <MemoGridContainer
                    key={props.windowId + "_container"}
                    items={sidebarMetadata?.items ? sidebarMetadata.items : null}
                    layout={sidebarMetadata.layout}
                    className={sidebarMetadata.className}
                    context={context || {}}>
                </MemoGridContainer>
            </div>
            : <div className="layout-main">
                <h3>{props.settings.header ? props.settings.header : null}</h3>
            </div>
        }

    </PrimeSidebar>
}

export default Sidebar;