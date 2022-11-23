import { classNames } from "primereact/utils";
import React from "react";

export const TEXT_XS = 1;
export const TEXT_SM = 2;
export const TEXT_BASE = 3;
export const TEXT_LG = 4;
export const TEXT_XL = 5;
export const TEXT_2XL = 6;
export const TEXT_3XL = 7;

export const TEXT_SIZES = {
	[TEXT_XS]: "text-xs",
	[TEXT_SM]: "text-sm",
	[TEXT_BASE]: "text-base",
	[TEXT_LG]: "text-lg",
	[TEXT_XL]: "text-xl",
	[TEXT_2XL]: "text-2xl",
	[TEXT_3XL]: "text-3xl",
	"text-xs": TEXT_XS,
	"text-sm": TEXT_SM,
	"text-base": TEXT_BASE,
	"text-lg": TEXT_LG,
	"text-xl": TEXT_XL,
	"text-2xl": TEXT_2XL,
	"text-3xl": TEXT_3XL,
}
const EditorTextSize = (props) => {
	const onChange = (size) => {
		props.onChange(size);
	}
	
	const textSizesDescriptions = {[TEXT_XS]: "XSmall", [TEXT_SM]: "Small", [TEXT_BASE]: "Default", [TEXT_LG]: "Large", [TEXT_XL]: "XLarge"};
	return <div className="flex flex-row flex-wrap gap-2">
		{
			Object.keys(textSizesDescriptions).map((s) => parseInt(s)).map((size) => (
				<span key={size} className={classNames("flex flex-column flex-auto justify-content-evenly align-items-center p-2 border-round cursor-pointer transition-all",
				TEXT_SIZES[size],
				{ "bg-primary text-white shadow-2": props.textSize === size})} onClick={() => onChange(size)}>
					<span>Aa</span>
					<span>{textSizesDescriptions[size]}</span>
				</span>
			))
		}
	</div>
}
export default EditorTextSize;