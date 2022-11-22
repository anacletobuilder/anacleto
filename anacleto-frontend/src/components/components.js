import AutoComplete from './controls/autoComplete';
import Avatar from './controls/avatar';
import Badge from './controls/badge';
import Calendar from './controls/calendar';
import Checkbox from './controls/checkbox';
import Chips from './controls/chips';
import Divider from './controls/divider';
import Dropdown from './controls/dropdown';
import Icons from './controls/icons';
import Image from './controls/image';
import MemoButton from './controls/button';
import MemoCodeEditor from './controls/codeEditor';
import MemoDataTable from './panels/dataTable';
import MemoFlow from './panels/flow';
import MemoForm from './panels/form';
import MemoGridContainer from './panels/gridContainer';
import MemoLabel from './controls/label';
import MemoPreview from './panels/preview';
import MemoTextInput from './controls/textInput';
import MemoTree from './panels/tree';
import NumberInput from './controls/numberInput';
import SelectButton from './controls/selectButton';
import MemoSplitter from './panels/splitter';
import Stack from './panels/stack';
import SwitchInput from './controls/switchInput';
import MemoTabView from './panels/tabview';
import Tag from './controls/tag';
import TextareaInput from './controls/textareaInput';
import ToggleButton from './controls/toggleButton';

const components = {
	AutoComplete,
	Avatar,
	Badge,
	Calendar,
	Checkbox,
	Chips,
	Divider,
	Dropdown,
	Icons,
	Image,
	MemoButton,
	MemoCodeEditor,
	MemoDataTable,
	MemoFlow,
	MemoForm,
	MemoGridContainer,
	MemoLabel,
	MemoPreview,
	MemoTextInput,
	MemoTree,
	NumberInput,
	SelectButton,
	MemoSplitter,
	Stack,
	SwitchInput,
	MemoTabView,
	Tag,
	TextareaInput,
	ToggleButton,
}

export const componentHasProps = (component, prop) => {
	const comp = components["Memo" + component] || components[component];
	const compProps = comp.propTypes || comp.type.propTypes;

	if(!compProps){
		console.warn(`Component ${component} doesn't export propTypes. It's always a good idea to export them to make coding easier and more robust.`);
		return false;
	}else if(!compProps[prop]){
		return false;
	}
	return true;
	
}
export default components;