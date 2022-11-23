import { classNames } from "primereact/utils";
import React from "react";

export const FONT_LIGHT = 1;
export const FONT_NORMAL = 2;
export const FONT_MEDIUM = 3;
export const FONT_SEMIBOLD = 4;
export const FONT_BOLD = 5;

export const FONT_WEIGHTS = {
	[FONT_LIGHT]: "font-light",
	[FONT_NORMAL]: "font-normal",
	[FONT_MEDIUM]: "font-medium",
	[FONT_SEMIBOLD]: "font-semibold",
	[FONT_BOLD]: "font-bold",
	"font-light": FONT_LIGHT,
	"font-normal": FONT_NORMAL,
	"font-medium": FONT_MEDIUM,
	"font-semibold": FONT_SEMIBOLD,
	"font-bold": FONT_BOLD,
}
const EditorFontWeight = (props) => {
	const onChange = (weight) => {
		props.onChange(weight);
	}
	
	return <div className="flex flex-row flex-wrap gap-2">
		{
			[FONT_LIGHT, FONT_NORMAL, FONT_MEDIUM, FONT_SEMIBOLD, FONT_BOLD].map((weight) => (
				<span key={weight} className={classNames("flex flex-column flex-auto justify-content-evenly align-items-center text-lg p-2 border-round cursor-pointer transition-all",
				FONT_WEIGHTS[weight],
				{ "bg-primary text-white shadow-2": props.fontWeight === weight})} onClick={() => onChange(weight)}>
					<span>Aa</span>
					<span>{FONT_WEIGHTS[weight].split("-")[1][0].toUpperCase() + FONT_WEIGHTS[weight].split("-")[1].slice(1)}</span>
				</span>
			))
		}
	</div>
}
export default EditorFontWeight;