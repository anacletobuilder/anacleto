import Editor, { loader, useMonaco } from "@monaco-editor/react";
import React, { useState, useEffect, useRef, useContext } from "react";
import { classNames } from "primereact/utils";
import PropTypes from "prop-types";
import "./codeEditor.css";
import { defaultMemoizeFunction } from "../../utils/utils";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { showAutocompletion } from "./codeEditorUtils";


function CodeEditor({ id, context, panelContext, ...props }) {
	const { updatePanelContext } = useContext(PanelsContext);
	const [disabled, setDisabled] = useState(props.disabled);
	const monaco = useMonaco();

	loader.config({ "vs/nls": { availableLanguages: { "*": "it" } } });

	useEffect(() => {
		console.log(`Component (ID ${id}) initializing.`);

		//Initialize the panelContext
		updatePanelContext({
			id,
			setDisabled,
		});
	}, []);

	useEffect(() => {
		if (typeof props.disabled !== typeof undefined) {
			setDisabled(props.disabled);
		}
	}, [props.disabled]);



	useEffect(() => {
		//load autocompletion

		const options = { scope: props.scope }

		const disposable = showAutocompletion(monaco, options);
		return disposable?.dispose;
	}, [monaco]);

	if(panelContext._status !== PANEL_STATUS_READY) return;
	
	const onMount = (editor, monaco) => {
		//editor mount, ex monaco.focus()
	}

	function onChange(_newValue, _event) {
		if (props.setRecord) {
			props.setRecord({ [id]: _newValue });
		}
		if (props.onChange) {
			props.onChange(_event, _newValue); //imposta il valore nella context
		}
	}

	//altre opzioni https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html
	return (
		<div
			id={"editor-container-" + id}
			className={classNames("editorContainer", "w-full")}
			style={{ ...props.style, height: props.height || "100%" }}
		>
			{props.children}
			<Editor
				defaultValue={props.defaultValue}
				value={props.record[id] || ""}
				theme={props.theme || "light"}
				language={props.language || "javascript"}
				locale={"it"}
				onChange={onChange}
				onMount={onMount}
				options={{
					readOnly: disabled,
					domReadOnly: disabled,
					automaticLayout: true,
				}}
			/>
		</div>
	);
}
const MemoCodeEditor = React.memo(CodeEditor, (prev, next) => {
	return defaultMemoizeFunction(CodeEditor.propTypes, prev, next);
});

CodeEditor.propTypes = {
	id: PropTypes.string.isRequired,
	updatePanelContext: PropTypes.func,
	forwardData: PropTypes.any,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	panelContext: PropTypes.object.isRequired,
	setIsLoading: PropTypes.func,
	context: PropTypes.object.isRequired,
	className: PropTypes.string,
	isCard: PropTypes.bool,
	title: PropTypes.string,
	panelBaseMethods: PropTypes.object,
	disabled: PropTypes.bool,
	theme: PropTypes.oneOf(["dark", "light"]),
	language: PropTypes.string,
	defaultValue: PropTypes.string,
	height: PropTypes.string,
	setRecord: PropTypes.func,
	style: PropTypes.object,
	scope: PropTypes.string,
}
export default MemoCodeEditor;