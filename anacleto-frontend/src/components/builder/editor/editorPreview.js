import { classNames } from "primereact/utils";
import React from "react";
import { FLEX_ALIGNMENT, FLEX_JUSTIFICATION } from "./editorFlexAlignment";
import { FLEX_DIRECTIONS } from "./editorFlexDirection";
import { TEXT_SIZES } from "./editorTextSize";
import { FONT_WEIGHTS } from "./editorFontWeight";
import { PADDINGS } from "./editorPadding";
import { WIDTHS } from "./editorWidth";

const EditorPreview = (props) => {
	//<span className="text-xl font-bold mb-4">Element Preview</span>
	/*
		<span className="block text-m font-semibold">{`${props.attributes.id}`}</span>
		<span className="block text-s">{`${props.attributes.component}`}</span>
	*/
	return <React.Fragment>
		<span className="text-m font-semibold">{`${props.attributes.component}: ${props.attributes.id}`}</span>
		<div className={classNames("transition-all border-round shadow-6 bg-primary-400", props.width ? WIDTHS[props.width] : "col-fixed", PADDINGS[props.padding])} style={{ minHeight: "3rem" }}>
			<div className={classNames("flex w-full transition-all border-round bg-primary text-white gap-3 p-2", FLEX_DIRECTIONS[props.flexDirection], FLEX_JUSTIFICATION[props.flexJustify], FLEX_ALIGNMENT[props.flexAlign], TEXT_SIZES[props.textSize], FONT_WEIGHTS[props.fontWeight])}
				style={{ minHeight: "3rem" }}>
				<span>{`[1]`}</span>
				<span>{`[2]`}</span>
				<span>{`[3]`}</span>
			</div>
		</div>
	</React.Fragment>
}
export default EditorPreview;