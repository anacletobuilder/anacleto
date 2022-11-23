import React, { useEffect, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import MemoComponent from "../../component";
import { classNames } from "primereact/utils";

export const PADDING_0 = 0;
export const PADDING_1 = 1;
export const PADDING_2 = 2;
export const PADDING_3 = 3;
export const PADDING_4 = 4;
export const PADDING_5 = 5;
export const PADDING_6 = 6;
export const PADDING_7 = 7;
export const PADDING_8 = 8;

export const PADDINGS = {
	[PADDING_0]: "p-2",
	[PADDING_1]: "p-1",
	[PADDING_2]: "p-2",
	[PADDING_3]: "p-3",
	[PADDING_4]: "p-4",
	[PADDING_5]: "p-5",
	[PADDING_6]: "p-6",
	[PADDING_7]: "p-7",
	[PADDING_8]: "p-8",
	"p-2": PADDING_0,
	"p-1": PADDING_1,
	"p-2": PADDING_2,
	"p-3": PADDING_3,
	"p-4": PADDING_4,
	"p-5": PADDING_5,
	"p-6": PADDING_6,
	"p-7": PADDING_7,
	"p-8": PADDING_8,
}

const EditorPadding = (props) => {
	const onChange = (padding) => {
		props.onChange(padding);
	}
	
	return <div className="flex flex-column col-12 md:col-8 mx-auto">
		<div className="flex-auto flex flex-row px-4 justify-content-center align-items-center pointer-events-none select-none gap-1 md:gap-4">
			<div className={classNames("transition-all mb-2 border-round bg-primary-400", PADDINGS[props.padding])}>
				<Skeleton className="p-2 flex align-items-center justify-content-center bg-primary" animation="none" width="100%" height="10rem"><span className="font-bold text-3xl text-white">{ `Padding ${props.padding || "auto"}` }</span></Skeleton>
			</div>
		</div>

		<MemoComponent component="Slider" id="field-editor-size-slider" min={PADDING_0} max={PADDING_8} step={1} value={props.padding} onChange={onChange} className="flex-auto mt-2" />
	</div>
}
export default EditorPadding;