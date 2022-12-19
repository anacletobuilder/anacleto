import React, { useState, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { defaultMemoizeFunction } from "../../utils/utils";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { Skeleton } from "primereact/skeleton";
import { classNames } from "primereact/utils";
import MemoComponent from "../component";
import EditorFlexAlignment, { ALIGN_START, FLEX_ALIGNMENT, FLEX_JUSTIFICATION, JUSTIFY_START } from "./editor/editorFlexAlignment";
import EditorFlexDirection, { FLEX_COLUMN, FLEX_COLUMN_REVERSE, FLEX_DIRECTIONS, FLEX_ROW, FLEX_ROW_REVERSE } from "./editor/editorFlexDirection";
import EditorWidth, { WIDTHS, WIDTH_0 } from "./editor/editorWidth";
import EditorPadding, { PADDINGS, PADDING_0 } from "./editor/editorPadding";
import EditorTextSize, { TEXT_BASE, TEXT_LG, TEXT_SM, TEXT_XL, TEXT_XS } from "./editor/editorTextSize";
import EditorFontWeight, { fontWeights, FONT_BOLD, FONT_LIGHT, FONT_MEDIUM, FONT_NORMAL, FONT_SEMIBOLD, FONT_WEIGHTS } from "./editor/editorFontWeight";
import EditorPreview from "./editor/editorPreview";
import { TEXT_SIZES } from "./editor/editorTextSize";
const { v4: uuidv4 } = require("uuid");

const FieldEditor = ({ id, context, panelContext, windowData, ...props }) => {
	const application = context.application;
	const destApplication = context.destApplication;
	const tenant = context.tenant;
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);
	const [fieldData, setFieldData] = useState(props.windowData || { node: { attributes: {}}});
	useEffect(() => {
		updatePanelContext({
			id,
			setFieldData,
		});
	}, []);

	let classNameBreakpoints = { xs: [], sm: [], md: [], lg: [], xl: [] };
	fieldData.node.attributes.className?.split(" ").map((cl) => {
		if(cl.startsWith("sm:")){ classNameBreakpoints.sm.push(cl.replace("sm:", "")); }
		else if(cl.startsWith("md:")){ classNameBreakpoints.md.push(cl.replace("md:", "")); }
		else if(cl.startsWith("lg:")){ classNameBreakpoints.lg.push(cl.replace("lg:", "")); }
		else if(cl.startsWith("xl:")){ classNameBreakpoints.xl.push(cl.replace("xl:", "")); }
		else{ classNameBreakpoints.xs.push(cl.replace("xs:", "")); }
	});
	const getClassnamesFromBreakpoints = useCallback((className) => {
		return Object.keys(classNameBreakpoints).map((bp) => ({[bp]: classNameBreakpoints[bp].filter((cl) => cl.startsWith(className))})).reduce((p, n) => ({ ...p, ...n }), {});
	}, [classNameBreakpoints]);

	const getFlexDirection = () =>
	FLEX_DIRECTIONS[
		getClassnamesFromBreakpoints('flex-').xs.filter(
			(fd) =>
			[
				FLEX_DIRECTIONS[FLEX_ROW],
				FLEX_DIRECTIONS[FLEX_COLUMN],
				FLEX_DIRECTIONS[FLEX_ROW_REVERSE],
				FLEX_DIRECTIONS[FLEX_COLUMN_REVERSE],
			].indexOf(fd) >= 0
		)[0]
	];
	const getFlexJustify = () => (
		FLEX_JUSTIFICATION[getClassnamesFromBreakpoints("justify-content-").xs[0]] || JUSTIFY_START
	);
	const getFlexAlign = () => (
		FLEX_ALIGNMENT[getClassnamesFromBreakpoints("align-items-").xs[0]] || ALIGN_START
	);
	const getWidth = () => (
		WIDTHS[(getClassnamesFromBreakpoints("col-").xs[0] || "col")] || WIDTH_0
	);
	const getPadding = () => (
		PADDINGS[getClassnamesFromBreakpoints("p-").xs[0] || PADDING_0]
	);
	const getTextSize = () =>
	TEXT_SIZES[
		getClassnamesFromBreakpoints('text-').xs.filter(
			(fs) =>
			[
				TEXT_SIZES[TEXT_XS],
				TEXT_SIZES[TEXT_SM],
				TEXT_SIZES[TEXT_BASE],
				TEXT_SIZES[TEXT_LG],
				TEXT_SIZES[TEXT_XL],
			].indexOf(fs) >= 0
		)[0] || 'text-base'
	];
	const getFontWeight = () =>
	FONT_WEIGHTS[
		getClassnamesFromBreakpoints('font-').xs.filter(
			(fw) =>
			[
				FONT_WEIGHTS[FONT_LIGHT],
				FONT_WEIGHTS[FONT_NORMAL],
				FONT_WEIGHTS[FONT_MEDIUM],
				FONT_WEIGHTS[FONT_SEMIBOLD],
				FONT_WEIGHTS[FONT_BOLD],
			].indexOf(fw) >= 0
		)[0] || 'font-normal'
	];

	/* EDITOR STATES */
	const [previewBreakpoint, setPreviewBreakpoint] = useState("xs");
	const [flexDirection, setFlexDirection] = useState(getFlexDirection());
	const [width, setWidth] = useState(getWidth());
	const [flexJustify, setFlexJustify] = useState(getFlexJustify());
	const [flexAlign, setFlexAlign] = useState(getFlexAlign());
	const [textSize, setTextSize] = useState(getTextSize());
	const [fontWeight, setFontWeight] = useState(getFontWeight());
	const [padding, setPadding] = useState(getPadding());

	const getClassNames = () => {
		let classnames = "";
		//Add all breakpoints classes to classnames, except for the current breakpoing
		Object.keys(classNameBreakpoints)
		.filter((bp) => bp !== previewBreakpoint)
		.map((bp) =>
			classNameBreakpoints[bp]
			.map((cl) => (classnames += `${bp !== 'xs' ? bp + ':' : ''}${cl}`))
			.join(' ')
		);

		const allClassesRegex = [
			Object.keys(FLEX_DIRECTIONS).filter((p) => parseInt(p) != p).join("|"),
			Object.keys(FLEX_JUSTIFICATION).filter((p) => parseInt(p) != p).join("|"),
			Object.keys(FLEX_ALIGNMENT).filter((p) => parseInt(p) != p).join("|"),
			Object.keys(TEXT_SIZES).filter((p) => parseInt(p) != p).join("|"),
			Object.keys(FONT_WEIGHTS).filter((p) => parseInt(p) != p).join("|"),
			Object.keys(WIDTHS).filter((p) => parseInt(p) != p).join("|"),
			Object.keys(PADDINGS).filter((p) => parseInt(p) != p).join("|"),
		].join("|");

		classNameBreakpoints[previewBreakpoint].map((cl) => {
			if(new RegExp(allClassesRegex.replace(/^|(\|)/g, "$1^")).test(cl) === false){
				classnames += ` ${previewBreakpoint !== 'xs' ? previewBreakpoint + ':' : ''}${cl}`;
			}
		});

		[
			FLEX_DIRECTIONS[flexDirection],
			WIDTHS[width],
			FLEX_JUSTIFICATION[flexJustify],
			FLEX_ALIGNMENT[flexAlign],
			TEXT_SIZES[textSize],
			FONT_WEIGHTS[fontWeight],
			PADDINGS[padding],
		]
		.filter(Boolean)
		.map(
			(cl) =>
			(classnames += ` ${
				previewBreakpoint !== 'xs' ? previewBreakpoint + ':' : ''
			}${cl}`)
		);

		return classnames;
	}

	useEffect(() => {
		//Update panel
		setFlexDirection(getFlexDirection());
		setWidth(getWidth());
		setFlexJustify(getFlexJustify());
		setFlexAlign(getFlexAlign());
		setTextSize(getTextSize());
		setFontWeight(getFontWeight());
		setPadding(getPadding());
	}, [fieldData.node.attributes]);


	//Listen to state changes to update element className
	const [stateDebounceTimeout, setStateDebounceTimeout] = useState(null);
	useEffect(() => {
		if(!fieldData.node.attributes.component) return;
		clearTimeout(stateDebounceTimeout);

		const updatedClassNames = getClassNames();
		setStateDebounceTimeout(
			setTimeout((({ fieldData, updatedClassNames, panel, context, panelsContext, updatePanelContext, panelContext}) => {

				//Update record classnames
				/*setFieldData((prev) => ({
					...prev,
					node: {
						...prev.node,
						attributes: {
							...prev.node.attributes,
							className: updatedClassNames
						}
					}
				}));*/
				//Update flow nodes
				if(props.events.onElementChange){
					props.events.onElementChange.bind({ panel, context, windowData, components:panelsContext, updatePanelContext, ...panelContext })(fieldData, updatedClassNames);
				}
			}).bind(null, { fieldData: fieldData.node, updatedClassNames, panel: props, context, windowData, components:panelsContext, updatePanelContext, panelContext }), 1000)
		);
	}, [flexDirection, width, flexJustify, flexAlign, textSize, fontWeight, padding]);

	const onChange = (value) => {
		setWidth(value);
	}
	
	const handleFlexDirectionChange = useCallback((direction) => {
		setFlexDirection(direction);
	},[]);

	const handleFlexAlignmentChange = useCallback((justify, align) => {
		setFlexJustify(justify);
		setFlexAlign(align);
	},[]);

	const handleWidthChange = useCallback((width) => {
		setWidth(width);
	},[]);

	const handleTextSizeChange = useCallback((size) => {
		setTextSize(size);
	},[]);

	const handleFontWeightChange = useCallback((weight) => {
		setFontWeight(weight);
	},[]);

	const handlePaddingChange = useCallback((padding) => {
		setPadding(padding);
	},[]);

	if(panelContext._status !== PANEL_STATUS_READY || !fieldData.node.attributes.component) return <React.Fragment />;
	const sections = [
		{
			title: "Flex Direction",
			element: <EditorFlexDirection flexDirection={flexDirection} onChange={handleFlexDirectionChange} />,
			//renderIf: ["Form", "GridContainer"].indexOf(fieldData.node.attributes.component) >= 0 && fieldData.node.attributes.layout === 'flex'
		},
		{
			title: "Flex Alignment",
			element: <EditorFlexAlignment flexDirection={flexDirection} flexJustify={flexJustify} flexAlign={flexAlign} onChange={handleFlexAlignmentChange} />,
			//renderIf: ["Form", "GridContainer"].indexOf(fieldData.node.attributes.component) >= 0 && fieldData.node.attributes.layout === 'flex'
		},
		{
			title: "Element Width",
			element: <EditorWidth width={width} onChange={handleWidthChange} />
		},
		{
			title: "Padding",
			element: <EditorPadding padding={padding} onChange={handlePaddingChange} />
		},
		{
			title: "Text Size",
			element: <EditorTextSize textSize={textSize} onChange={handleTextSizeChange} />
		},
		{
			title: "Font Weight",
			element: <EditorFontWeight fontWeight={fontWeight} onChange={handleFontWeightChange} />
		},
	];

	const handleFormFieldChange = (id, event, attributes) => {
		console.log("OnChange ", id, event, attributes);
	}
	return (<React.Fragment>
		<div className="hidden xl:flex flex-column justify-content-center align-items-center absolute top-0 right-0 mr-3 pl-3 w-full z-5 bg-white">
			<EditorPreview
				flexDirection={flexDirection}
				flexJustify={flexJustify}
				flexAlign={flexAlign}
				width={width}
				padding={padding}
				textSize={textSize}
				fontWeight={fontWeight}
				attributes={fieldData.node.attributes}
			/>
		</div>
		<div className={classNames((props.className || ""), "flex flex-column flex-auto gap-4 overflow-auto xl:mt-8 xl:pt-8")} style={{ height: 0 }}>
			<div className={classNames("flex flex-column flex-auto xl:mt-8 xl:pt-6")}>
				{ sections.map((s, i) => (
					<React.Fragment key={s.title}>
						{(typeof s.renderIf === typeof undefined || s.renderIf) && <div className={classNames("flex flex-column mb-6", { [`xl:${PADDINGS[padding]}`]: i === 0 })}>
							<span className="text-xl font-bold mb-3">{ s.title }</span>
							{s.element}
						</div>}
					</React.Fragment>
				))}
			</div>
			<div className="flex flex-column flex-auto">
				<MemoComponent component="Form" title="Props" layout="flex" className="flex-column flex-auto" id="field-editor-form" record={fieldData.node.attributes}>
					{Object.keys(fieldData.node.attributes).map((key) => {
						const comp = fieldData.node.attributes[key] === true || fieldData.node.attributes[key] === false ? "Checkbox" : "TextInput";
						return <MemoComponent
							id={key}
							key={key}
							component={comp}
							containerClassName="p-2 my-1"
							label={key[0].toUpperCase() + key.slice(1)}
							value={fieldData.node.attributes[key]}
							disabled={['id', 'component'].indexOf(key) >= 0}
							onChange={(e) => handleFormFieldChange(key, e, fieldData.node.attributes)}
						/>
					})}
				</MemoComponent>
			</div>
		</div>
	</React.Fragment>);
}

FieldEditor.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	windowData: PropTypes.any,
	className: PropTypes.string,
	setIsLoading: PropTypes.func,
	record: PropTypes.object,
	events: PropTypes.object,
	setRecord: PropTypes.func,
};

const MemoFieldEditor = React.memo(FieldEditor, (prev, next) => {
	return defaultMemoizeFunction(FieldEditor.propTypes, prev, next);
});

MemoFieldEditor.displayName = "FieldEditor";
export default MemoFieldEditor;