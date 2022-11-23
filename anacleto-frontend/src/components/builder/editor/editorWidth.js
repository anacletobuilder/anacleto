import React, { useEffect, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import MemoComponent from "../../component";
import { classNames } from "primereact/utils";

export const WIDTH_0 = 0;
export const WIDTH_1 = 1;
export const WIDTH_2 = 2;
export const WIDTH_3 = 3;
export const WIDTH_4 = 4;
export const WIDTH_5 = 5;
export const WIDTH_6 = 6;
export const WIDTH_7 = 7;
export const WIDTH_8 = 8;
export const WIDTH_9 = 9;
export const WIDTH_10 = 10;
export const WIDTH_11 = 11;
export const WIDTH_12 = 12;

export const WIDTHS = {
	[WIDTH_0]: "col",
	[WIDTH_1]: "col-1",
	[WIDTH_2]: "col-2",
	[WIDTH_3]: "col-3",
	[WIDTH_4]: "col-4",
	[WIDTH_5]: "col-5",
	[WIDTH_6]: "col-6",
	[WIDTH_7]: "col-7",
	[WIDTH_8]: "col-8",
	[WIDTH_9]: "col-9",
	[WIDTH_10]: "col-10",
	[WIDTH_11]: "col-11",
	[WIDTH_12]: "col-12",
	"col": WIDTH_0,
	"col-1": WIDTH_1,
	"col-2": WIDTH_2,
	"col-3": WIDTH_3,
	"col-4": WIDTH_4,
	"col-5": WIDTH_5,
	"col-6": WIDTH_6,
	"col-7": WIDTH_7,
	"col-8": WIDTH_8,
	"col-9": WIDTH_9,
	"col-10": WIDTH_10,
	"col-11": WIDTH_11,
	"col-12": WIDTH_12,
}

const EditorWidth = (props) => {
	const onChange = (width) => {
		props.onChange(width);
	}
	
	return <div className="flex flex-column col-12 md:col-8 mx-auto">
		<div className="flex-auto flex flex-row px-4 justify-content-center align-items-center pointer-events-none select-none gap-1 md:gap-4">
			<div className={classNames("transition-all mb-2 p-0", WIDTHS[Math.floor((WIDTH_12 - props.width) / 2)])}>
				<Skeleton className="p-2 flex align-items-center justify-content-center" animation="none" width="100%" height="8rem"><span className="font-bold text-xl">{ Math.floor((WIDTH_12 - props.width) / 2) }</span></Skeleton>
			</div>
			<div className={classNames("transition-all mb-2 p-0", props.width ? WIDTHS[props.width] : "col-fixed")}>
				<Skeleton className="p-2 flex align-items-center justify-content-center bg-primary" animation="none" width="100%" height="10rem"><span className="font-bold text-3xl text-white">{ props.width || "auto" }</span></Skeleton>
			</div>
			<div className={classNames("transition-all mb-2 p-0", WIDTHS[Math.floor((WIDTH_12 - props.width) / 2)])}>
				<Skeleton className="p-2 flex align-items-center justify-content-center" animation="none" width="100%" height="8rem"><span className="font-bold text-xl">{ Math.floor((WIDTH_12 - props.width) / 2) }</span></Skeleton>
			</div>
		</div>

		<MemoComponent component="Slider" id="field-editor-size-slider" min={WIDTH_0} max={WIDTH_12} step={1} value={props.width} onChange={onChange} className="flex-auto mt-2" />
	</div>
}
export default EditorWidth;