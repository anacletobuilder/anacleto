import Editor, { loader, useMonaco } from "@monaco-editor/react";
import React, { useState, useEffect, useRef, useContext } from "react";
import { classNames } from "primereact/utils";
import PropTypes from "prop-types";
import "./codeEditor.css";
import { defaultMemoizeFunction } from "../../utils/utils";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { showAutocompletion } from "./codeEditorUtils";


function CodeEditor({ id, context, panelContext, windowData, ...props }) {
	const { panelsContext, updatePanelContext } = useContext(PanelsContext);
	const [disabled, setDisabled] = useState(props.disabled);
	const [editor, setEditor] = useState(null);
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
		if (editor) {
			//save contest on editor for addAction
			editor._context = context
			editor._windowData = windowData
			editor._panelsContext = panelsContext
			editor._updatePanelContext = updatePanelContext
			editor._panelContext = panelContext
		}
	}, [editor, panelsContext, windowData]);



	useEffect(() => {
		//load autocompletion function
		const options = { scope: props.scope }
		const disposable = showAutocompletion(monaco, options);
		return disposable?.dispose;
	}, [monaco]);


	if (panelContext._status !== PANEL_STATUS_READY) return;




	const onMount = (_editor, _monaco) => {
		setEditor(_editor)

		const blockContext = "editorTextFocus && !suggestWidgetVisible && !renameInputVisible && !inSnippetMode && !quickFixWidgetVisible";
		//Add save action
		_editor.addAction({
			id: "commandSave",
			label: "Save",
			keybindings: [_monaco.KeyMod.CtrlCmd | _monaco.KeyCode.KeyS],
			contextMenuGroupId: "2_execution",
			precondition: blockContext,
			run: (ed) => {
				if (props.events.onSave) {
					//Questa soluzione non mi piace ma sono stato costretto ad aggangiare tutto nell'editor perchè il contesto qui non è aggiornato 
					props.events.onSave.bind({ panel: props, context: ed._context, windowData: ed._windowData, components: ed._panelsContext, updatePanelContext: ed._updatePanelContext, ...ed._panelContext })();
					//props.events.onSave.bind({ panel: props, context, windowData, components: panelsContext, updatePanelContext, ...panelContext })();
					//this.executeCurrentContext(false, true);
				}
			},
		});

		//Add action delete
		_editor.addAction({
			id: "commandDelete",
			label: "Delete",
			//keybindings: [_monaco.KeyMod.CtrlCmd | _monaco.KeyCode.KeyD],
			contextMenuGroupId: "2_execution",
			precondition: blockContext,
			run: (ed) => {
				if (props.events.onDelete) {
					//Questa soluzione non mi piace ma sono stato costretto ad aggangiare tutto nell'editor perchè il contesto qui non è aggiornato 
					props.events.onDelete.bind({ panel: props, context: ed._context, windowData: ed._windowData, components: ed._panelsContext, updatePanelContext: ed._updatePanelContext, ...ed._panelContext })();
					//props.events.onDelete.bind({ panel: props, context, windowData, components: panelsContext, updatePanelContext, ...panelContext })();
					//this.executeCurrentContext(false, true);
				}
			},
		});

	}

	function onChange(_newValue, _event) {
		if (props.setRecord) {
			props.setRecord({ ...props.record, [id]: _newValue });
		}
		if (props.onChange) {
			props.onChange(_event, _newValue); //imposta il valore nella context
		}
	}

	//more docs: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html
	return (
		<div
			id={"editor-container-" + id}
			className={classNames("editorContainer", "w-full")}
			style={{ ...props.style, height: props.height || "100%" }}
		>
			{props.children}
			<Editor
				defaultValue={props.defaultValue}
				value={props?.record && props.record[id] || ""}
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
	windowData: PropTypes.any,
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
	style: PropTypes.object,
	scope: PropTypes.string,
	events: PropTypes.object,
}
export default MemoCodeEditor;