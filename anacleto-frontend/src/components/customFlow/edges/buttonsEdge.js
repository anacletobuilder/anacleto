import React from 'react';
import { getSmoothStepPath, getEdgeCenter, getMarkerEnd } from 'react-flow-renderer';

const foreignObjectSize = 40;
const onEdgeClick = (evt, id) => {
    evt.stopPropagation();
    alert(`Aggiungi a ${id}`);
  };

  function addButtonEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    }) {
        const edgePath = getSmoothStepPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
            });
        const [edgeCenterX, edgeCenterY] = getEdgeCenter({
            sourceX,
            sourceY,
            targetX,
            targetY,
        });

        return (
            <React.Fragment>
              <path
                id={id}
                style={style}
                d={edgePath}
                className="react-flow__edge-path"
                markerEnd={markerEnd}
              />
              <foreignObject
                  width={foreignObjectSize}
                  height={foreignObjectSize}
                  x={targetX - foreignObjectSize - 5}
                  y={targetY - 20}
                  className="edgebutton-foreignobject"
                  requiredExtensions="http://www.w3.org/1999/xhtml"
                >
                    <div style={{
                      background: "transparent",
                      width: "40px",
                      height: "40px",
                      display:"flex",
                      "justify-content": "center",
                      "align-items": "center",
                      "min-height": "40px",
                    }}>
                    <button style={{width: "20px",height: "20px",background: "#eee",border: "1px solid #fff",cursor: "pointer",
                    "border-radius": "50%","font-size": "12px","line-height": 1,}} onClick={(event) => onEdgeClick(event, id)}>
                      +
                    </button>
                    </div>
                    
                </foreignObject>
            </React.Fragment>
          );

  }

  export default addButtonEdge;