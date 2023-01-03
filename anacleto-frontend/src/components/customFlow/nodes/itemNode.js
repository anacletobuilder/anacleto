import React from 'react';
import { Handle,Position } from 'react-flow-renderer';

function itemNode(props) {
    return (
        <div className="surface-0 shadow-2 p-2 pt-3 pl-3 border-1 border-50 border-round w-18rem ">
            <Handle type="target" position={Position.Left} style={{"borderRadius": 0,"border": "none","height": "1px","width": "4px","background": "#b1b1b7"}}/>
            <div className="flex m-0 mb-2 w-full border-200 align-items-center" >
                <div className="flex align-items-center bg-blue-100 border-round m-0" style={{ width: '2rem', height: '2rem' }}>
                    <i className="pi pi-box text-blue-500 text-m pl-2"></i>
                </div>
                <div>
                    <span className="block pl-2 text-m font-semibold">{`${props.id}`}</span>
                    <span className="block pl-2 text-700 text-xs">{`${props.data.component}`}</span>
                </div>
            </div>
            <Handle type="source" position={Position.Right} style={{"borderRadius": 0,"border": "none","height": "1px","width": "4px","background": "#b1b1b7"}} />
        </div>
    );
}

function windowNode(props) {
    return (
        <div className="surface-0 shadow-2 p-2 pt-3 pl-3 border-1 border-50 border-round w-18rem">
            <div className="flex m-0 mb-2 w-full border-200 align-items-center" >
                <div className="flex align-items-center bg-yellow-100 border-round m-0" style={{ width: '2rem', height: '2rem' }}>
                    <i className="pi pi-th-large text-yellow-500 text-m pl-2"></i>
                </div>
                <div>
                    <span className="block pl-2 text-m font-semibold">{`${props.id}`}</span>
                    <span className="block pl-2 text-700 text-xs">{`${props.data.component}`}</span>
                </div>
            </div>
            <Handle type="source" position={Position.Right} style={{"borderRadius": 0,"border": "none","height": "1px","width": "4px","background": "#b1b1b7"}}/>
        </div>
    );
}

function eventNode(props) {
    return (
        <div className="surface-0 shadow-2 p-2 pt-3 pl-3 border-1 border-50 border-round w-18rem">
            <Handle type="target" position={Position.Left} style={{"borderRadius": 0,"border": "none","height": "1px","width": "4px","background": "#b1b1b7"}}/>
            <div className="flex m-0 mb-2 w-full border-200 align-items-center" >
                <div className="flex align-items-center bg-green-100 border-round m-0" style={{ width: '2rem', height: '2rem' }}>
                    <i className="pi pi-code text-green-500 text-m pl-2"></i>
                </div>
                <div>
                    <span className="block  pl-2 text-m font-semibold">{`${props.data.label}`}</span>
                </div>
            </div>
        </div>
    );
}

function action(props) {
    return (
        <div className="surface-0 shadow-2 p-2 pt-3 pl-3 border-1 border-50 border-round w-18rem">
            <Handle type="target" position={Position.Left} style={{"borderRadius": 0,"border": "none","height": "1px","width": "4px","background": "#b1b1b7"}}/>
            <div className="flex m-0 mb-2 w-full border-200 align-items-center" >
                <div className="flex align-items-center bg-cyan-100 border-round m-0" style={{ width: '2rem', height: '2rem' }}>
                    <i className="pi pi-bolt text-cyan-500 text-m pl-2"></i>
                </div>
                <div>
                    <span className="block uppercase pl-2 text-sm">{`${props.data.label}`}</span>
                </div>
            </div>
            <Handle type="source" position={Position.Right} style={{"borderRadius": 0,"border": "none","height": "1px","width": "4px","background": "#b1b1b7"}}/>
        </div>
    );
}

function addNode(props) {
    return (
        <div style={{ borderColor: "gray.300", border: "1px solid", borderRadius: "12px", height: "33px", display: "flex", alignItems: "center" }} className=" border-blue-500 text-blue-500 bg-white">
            <Handle type="target" position={Position.Left} style={{"borderRadius": 0,"border": "none","height": "1px","width": "4px","background": "#b1b1b7"}}/>
            <div style={{fontSize:14,color:"gray.900",textAlign:"center",borderRadius:"12px",padding:"4px 10px",align:"center",fontWeight:"bold"}} >
            {`+ Add component`}
            </div>
        </div>
    );
}

function addEventNode(props) {
    return (
        <div style={{borderColor:"gray.300",border:"1px solid",borderRadius:"12px",height:"33px",display:"flex",alignItems:"center" }} className="border-green-600 text-green-600 bg-white">
            <Handle type="target" position={Position.Left} style={{"borderRadius": 0,"border": "none","height": "1px","width": "4px","background": "#b1b1b7"}}/>
            <div style={{fontSize:14,color:"gray.900",textAlign:"center",borderRadius:"12px",padding:"4px 10px",align:"center",fontWeight:"bold"}} >
            {`+ Add event`}
            </div>
        </div>
    );
}

function addAction(props) {
    return (
        <div style={{borderColor:"gray.300",border:"1px solid",borderRadius:"12px",height:"33px",display:"flex",alignItems:"center" }} className="border-cyan-600 text-cyan-600 bg-white">
            <Handle type="target" position={Position.Left} style={{"borderRadius": 0,"border": "none","height": "1px","width": "4px","background": "#b1b1b7"}}/>
            <div style={{fontSize:14,color:"gray.900",textAlign:"center",borderRadius:"12px",padding:"4px 10px",align:"center",fontWeight:"bold"}} >
            {`+ Add Action`}
            </div>
        </div>
    );
}



export {itemNode,windowNode,eventNode,action,addNode,addEventNode,addAction};