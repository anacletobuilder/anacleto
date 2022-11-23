import React, { useEffect, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { classNames } from "primereact/utils";
import { FLEX_COLUMN, FLEX_COLUMN_REVERSE, FLEX_ROW, FLEX_ROW_REVERSE } from "./editorFlexDirection";

export const JUSTIFY_START = 1;
export const JUSTIFY_CENTER = 2;
export const JUSTIFY_END = 3;
export const JUSTIFY_BETWEEN = 4;
export const JUSTIFY_AROUND = 5;
export const JUSTIFY_EVENLY = 6;

export const FLEX_JUSTIFICATION = {
	[JUSTIFY_START]:			"justify-content-start",
	[JUSTIFY_CENTER]:			"justify-content-center",
	[JUSTIFY_END]:				"justify-content-end",
	[JUSTIFY_BETWEEN]:			"justify-content-between",
	[JUSTIFY_AROUND]:			"justify-content-around",
	[JUSTIFY_EVENLY]:			"justify-content-evenly",
	"justify-content-start": 	JUSTIFY_START,
	"justify-content-center": 	JUSTIFY_CENTER,
	"justify-content-end": 		JUSTIFY_END,
	"justify-content-between": 	JUSTIFY_BETWEEN,
	"justify-content-around": 	JUSTIFY_AROUND,
	"justify-content-evenly": 	JUSTIFY_EVENLY,
}

export const ALIGN_START = 1;
export const ALIGN_CENTER = 2;
export const ALIGN_END = 3;
export const ALIGN_BETWEEN = 4;
export const ALIGN_AROUND = 5;
export const ALIGN_EVENLY = 6;

export const FLEX_ALIGNMENT = {
	[ALIGN_START]:			"align-items-start",
	[ALIGN_CENTER]:			"align-items-center",
	[ALIGN_END]:			"align-items-end",
	[ALIGN_BETWEEN]:		"align-items-between",
	[ALIGN_AROUND]:			"align-items-around",
	[ALIGN_EVENLY]:			"align-items-evenly",
	"align-items-start": 	ALIGN_START,
	"align-items-center": 	ALIGN_CENTER,
	"align-items-end": 		ALIGN_END,
	"align-items-between": 	ALIGN_BETWEEN,
	"align-items-around": 	ALIGN_AROUND,
	"align-items-evenly": 	ALIGN_EVENLY,
}

const EditorFlexAlignment = (props) => {
	const flexAlignmentSizes = [["100%", "50%", "25%"], ["50%", "100%", "50%"], ["25%", "50%", "100%"]];
	const [flexJustify, setFlexJustify] = useState((props.flexDirection === FLEX_ROW ? props.flexAlign : props.flexJustify));
	const [flexAlign, setFlexAlign] = useState((props.flexDirection === FLEX_ROW ? props.flexJustify : props.flexAlign));

	useEffect(() => {
		setFlexJustify((props.flexDirection === FLEX_ROW ? props.flexAlign : props.flexJustify));
		setFlexAlign((props.flexDirection === FLEX_ROW ? props.flexJustify : props.flexAlign));
	}, [props.flexJustify, props.flexAlign, props.flexDirection])

	const handleClick = (justify, align) => {
		if(props.flexDirection === FLEX_ROW){
			props.onChange(align, justify);
		}else{
			props.onChange(justify, align);
		}
	}

	return <div className="flex flex-column align-self-center gap-4 lg:gap-6 col-12 xl:col-10">
		{ [JUSTIFY_START, JUSTIFY_CENTER, JUSTIFY_END].map((j, i) => (<div key={`flex-j-${j}`} className="flex flex-row gap-4">
				{ [ALIGN_START, ALIGN_CENTER, ALIGN_END].map((a) => {
					return <div key={`flex-a-${a}`} className={classNames(FLEX_JUSTIFICATION[j], FLEX_ALIGNMENT[a], "flex flex-column flex-auto cursor-pointer mb-2 gap-1")} onClick={() => handleClick(j, a)}>
						<Skeleton
							className={classNames("transition-all", {"bg-primary": flexJustify === j && flexAlign === a})}
							animation="none"
							height="0.5rem"
							width={flexAlignmentSizes[i][0]}
						/>
						<Skeleton
							className={classNames("transition-all", {"bg-primary": flexJustify === j && flexAlign === a})}
							animation="none"
							height="0.5rem"
							width={flexAlignmentSizes[i][1]}
						/>
						<Skeleton
							className={classNames("transition-all", {"bg-primary": flexJustify === j && flexAlign === a})}
							animation="none"
							height="0.5rem"
							width={flexAlignmentSizes[i][2]}
						/>
					</div>
				})}
			</div>
		))}
	</div>
}
export default EditorFlexAlignment;