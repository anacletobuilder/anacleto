import React, { useState, useEffect, useRef, useContext } from "react";
import { DataTable as PrimeDataTable } from "primereact/datatable";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import axios from "axios";
import "./dataTable.css";
import { ContextMenu } from "primereact/contextmenu";
import { Skeleton } from "primereact/skeleton";
import { Ripple } from "primereact/ripple";
import { Dropdown } from "primereact/dropdown";
import PubParser from "../../utils/pugParser";
import { Button } from "primereact/button";
import { getToken } from "../../login/loginUtils";
import PropTypes from "prop-types";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { defaultMemoizeFunction } from "../../utils/utils";
import MemoComponent from "../component";
import { ComponentsContext } from "../../contexts/componentsContext";
import { useSelector } from 'react-redux';
import { selectApplication, selectDestApplication, selectTenant, selectWindow } from '../../reducers/context';
import { getTranslator } from '../../utils/translator';

const { v4: uuidv4 } = require("uuid");

function DataTable({ context, panelContext, ...props }) {
	const application = useSelector(selectApplication)
	const destApplication = useSelector(selectDestApplication)
	const tenant = useSelector(selectTenant)
	const window = useSelector(selectWindow)
	const t = getTranslator({application, window})

	const [list, setList] = useState([]);
	const [selectionMode, setSelectionMode] = useState(null);
	const [loading, setLoading] = useState(false);
	const panelId = props.id;
	const [menu, setMenu] = useState([]);
	const cm = useRef(null);
	const [contextMenuRow, setContextMenuRow] = useState(null);
	const [storeParams, setStoreParams] = useState(null);
	const [pageFirst, setPageFirst] = useState(0);
	const [pageRows, setPageRows] = useState(props.pageRows || 10);
	const [pageShowNext, setPageShowNext] = useState(false);
	const [filters, setFilters] = useState(null);
	const [globalFilterValue, setGlobalFilterValue] = useState("");
	const { updatePanelContext } = useContext(PanelsContext);
	const { componentHasProps } = useContext(ComponentsContext);

	useEffect(() => {
		updatePanelContext({
			id: panelId,
			load: function (_params) {
				setStoreParams(_params);
				fetchData(_params, pageFirst, pageRows);
			},
		});
	}, [])

	useEffect(() => {
		if(panelContext._status === PANEL_STATUS_READY){
			if (props.isMultipleSelection) {
				setSelectionMode("multiple");
			} else if (props.events?.onSelectionChange) {
				setSelectionMode("single");
			}

			if (props.globalFilterFields?.length > 0) {
				initFilters();
			}
		}
	}, [panelContext._status]);

	if(!panelContext._status === PANEL_STATUS_READY) return;

	const fetchData = async (_storeParams, _pageFirst, _pageRows) => {
		if (!props.store) {
			console.error(`Missing grid store: ${props.id}`);
			window.utils.showToast({
				severity: "error",
				summary: "Error",
				detail: "Missing store, can't load grid",
				sticky: true,
			});
			return;
		}

		setList(Array.from({ length: props.skeletonRow || 0 })); //righe fake per skeleton
		setLoading(true);

		getToken()
			.then((token) => {
				return axios.post(
					`${process.env.REACT_APP_BACKEND_HOST}/processScript?panel=${props.id}&script=${props.store}`,
					_storeParams,
					{
						timeout: 60000,
						headers: {
							Authorization: token,
							application: application,
							destapplication: destApplication,
							tenant: tenant,
							pagefirst:
								props.paginationType !== "client"
									? _pageFirst
									: undefined,
							pagerows:
								props.paginationType !== "client"
									? _pageRows
									: undefined,
						},
					}
				);
			})
			.then((res) => {
				if (Array.isArray(res.data)) {
					setList(res.data);
				} else if (Array.isArray(res.data.rows)) {
					setList(res.data.rows);
					setPageShowNext(res.data.hasMoreRows);
				} else {
					setList([]);
					window.utils.showToast({
						severity: "error",
						summary: "Error",
						detail: "Server error, can't load grid",
						sticky: true,
					});
				}
			})
			.catch((e) => {
				setList([]);
				window.utils.showToast({
					severity: "error",
					summary: "Error",
					detail: "Server error, can't load grid",
					sticky: true,
				});
			})
			.then(() => {
				setLoading(false);
			});
	};

	//#region TEMPLATES

	const imageBodyTemplate = (rowData, params) => {
		let image = null;

		try {
			const imageFiled = params.column.props.field;
			image = rowData[imageFiled];
		} catch (e) {}

		//referrerPolicy mi serve eventualmente per caricare le immagini senza header
		return (
			<img
				src={`${image}`}
				onError={(e) =>
					(e.target.src =
						"https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
				}
				alt={rowData.imageLocation}
				className="image"
			/>
		);
	};

	/**
	 * Data la struttura del nodo genera il dom usando react, uasto per i render
	 *
	 * Es di nodo:
	 *
	 * {
	 *   "tag": "div",
	 *   "props": {
	 *     "className": "flex flex-column"
	 *   },
	 *   "items": [
	 *     {
	 *       "tag": "span",
	 *       "props": {
	 *         "className": "p-text"
	 *       },
	 *       "items": [
	 *         "bla bla"
	 *       ]
	 *     },
	 *     {
	 *       "tag": "span",
	 *       "props": {
	 *         "className": "p-text"
	 *       },
	 *       "items": [
	 *         "bla bla"
	 *       ]
	 *     }
	 *   ]
	 * }
	 * @param {Object} node
	 * @returns
	 */
	const generateTemplateFromNodeStructure = (node) => {
		if (!node) {
			return;
		}

		if (!node.props) {
			node.props = {};
		}
		if (!node.props.key) {
			node.props.key = uuidv4();
		}

		return React.createElement(
			node.type,
			node.props,
			node.items?.map((_node) => {
				if (typeof _node === "object") {
					return generateTemplateFromNodeStructure(_node);
				}
				return _node;
			})
		);
	};
	//#endregion

	//#region ROW EDIT
	const onRowEditComplete = (e) => {
		let _list = [...list];
		let { newData, index } = e;

		_list[index] = newData;

		setList(_list);
	};

	const textEditor = (options) => {
		return (
			<InputText
				type="text"
				value={options.value}
				onChange={(e) => options.editorCallback(e.target.value)}
			/>
		);
	};

	const priceEditor = (options) => {
		return (
			<InputNumber
				value={options.value}
				onValueChange={(e) => options.editorCallback(e.value)}
				mode="currency"
				currency="USD"
				locale="en-US"
			/>
		);
	};

	const integerEditor = (options) => {
		return (
			<InputNumber
				value={options.value}
				onValueChange={(e) => options.editorCallback(e.value)}
			/>
		);
	};
	//#endregion

	//#region Menu contestuale
	const onContextMenu = function (_event) {
		let contextMenuItem = [];
		if (props.events?.onContextMenu) {
			contextMenuItem = props.events.onContextMenu(_event, props.context);
		}

		if (contextMenuItem && contextMenuItem.length > 0) {
			setMenu(contextMenuItem);
			cm.current.show(_event.originalEvent);
		}
	};
	//#endregion

	//#region PAGINAZIONE
	const onPageSizeChange = (event) => {
		setPageRows(event.value);
		fetchData(storeParams, pageFirst, event.value);
	};

	const onPageFirstNext = (event) => {
		setPageFirst(pageFirst + 1);
		fetchData(storeParams, pageFirst + 1, pageRows);
	};

	const onPageFirstPrev = (event) => {
		setPageFirst(pageFirst - 1);
		fetchData(storeParams, pageFirst - 1, pageRows);
	};

	const paginatorTemplateServer = {
		layout: "RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink",
		RowsPerPageDropdown: (options) => {
			const dropdownOptions = [
				{ label: 10, value: 10 },
				{ label: 20, value: 20 },
				{ label: 50, value: 50 },
			];

			return (
				<React.Fragment>
					<Dropdown
						value={options.value}
						options={dropdownOptions}
						onChange={onPageSizeChange}
					/>
				</React.Fragment>
			);
		},
		PrevPageLink: (options) => {
			let className = options.className;
			if (pageFirst > 0) {
				className = className.replace("p-disabled", "");
			}

			return (
				<button
					type="button"
					className={className}
					onClick={onPageFirstPrev}
					disabled={pageFirst === 0}
				>
					<span className="p-3">{"<"}</span>
					<Ripple />
				</button>
			);
		},
		NextPageLink: (options) => {
			let className = options.className;
			if (pageShowNext) {
				className = className.replace("p-disabled", "");
			}
			return (
				<button
					type="button"
					className={className}
					onClick={onPageFirstNext}
					disabled={!pageShowNext}
				>
					<span className="p-3">{">"}</span>
					<Ripple />
				</button>
			);
		},
		CurrentPageReport: (options) => {
			if (loading) {
				return undefined;
			}
			return (
				<span
					style={{
						color: "var(--text-color)",
						userSelect: "none",
						width: "120px",
						textAlign: "center",
					}}
				>
					Page {pageFirst + 1}
				</span>
			);
		},
	};

	const paginatorTemplateClient = {
		layout: "RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink",
		RowsPerPageDropdown: (options) => {
			const dropdownOptions = [
				{ label: 10, value: 10 },
				{ label: 20, value: 20 },
				{ label: 50, value: 50 },
				/*{ label: 100, value: 100 },
                { label: 1000, value: 1000 },
                { label: 10000, value: 10000 },*/
			];

			return (
				<React.Fragment>
					<span
						className="mx-1"
						style={{
							color: "var(--text-color)",
							userSelect: "none",
						}}
					>
						Items per page:{" "}
					</span>
					<Dropdown
						value={options.value}
						options={dropdownOptions}
						onChange={options.onChange}
					/>
				</React.Fragment>
			);
		},
		CurrentPageReport: (options) => {
			if (loading) {
				return undefined;
			}
			return (
				<span
					style={{
						color: "var(--text-color)",
						userSelect: "none",
						width: "120px",
						textAlign: "center",
					}}
				>
					{options.first} - {options.last} of {options.totalRecords}
				</span>
			);
		},
	};
	//#endregion

	//#region offline filter

	const renderFilterHeader = () => {
		if (!props.globalFilterFields?.length > 0) {
			return null;
		}

		return (
			<div className="flex justify-content-end gap-2">
				<span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText
						value={globalFilterValue}
						onChange={onGlobalFilterChange}
						placeholder="Search..."
					/>
				</span>
				<Button
					type="button"
					icon="pi pi-filter-slash"
					//tooltip="Pulisci"
					className="p-button"
					disabled={globalFilterValue?.length > 0 ? false : true}
					onClick={clearFilter}
				/>
			</div>
		);
	};

	const initFilters = () => {
		if (props.globalFilterFields?.length > 0) {
			const filterSetups = {
				global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			};

			setFilters(filterSetups);
			setGlobalFilterValue("");
		}
	};

	const clearFilter = () => {
		initFilters();
	};

	const onGlobalFilterChange = (e) => {
		if (props.globalFilterMode === "client") {
			const value = e.target.value;
			let _filters1 = { ...filters };
			_filters1["global"].value = value;

			setFilters(_filters1);
			setGlobalFilterValue(value);
		} else if (props.globalFilterMode === "server") {
			alert("globalFilterMode server work in progress");
		}
	};

	//#endregion

	//Columns
	let editCols = [];
	if (props.isEditable) {
		editCols.push(
			<Column
				rowEditor
				headerStyle={{ width: "5%", minWidth: "8rem" }}
				bodyStyle={{ textAlign: "center" }}
			></Column>
		);
	}

	const cols =
		props.columns?.map((col, i) => {
			if (loading) {
				return (
					<Column
						key={col.field}
						field={col.field}
						header={t(col.field, col.header)}
						body={<Skeleton></Skeleton>}
					/>
				);
			}
			let template = null;

			/**
			 * Gestione del template, ricorda...è assolutamente vietato usare renderHtmlString o peggio dangerouslySetInnerHTML, pena la perdita delle falangi :)
			 */
			if(col.component){
				//If component is specified, use the component as template, passing all the necessary props
				template = (rowData, columnOptions) => {
					/*
						For all the props specified in the column, try to pass them to the component by reading the value from the rowData
						Example: For the Avatar Component, the "image" prop can be specified.
						If the column definition is
						{ component: "Avatar", field: "photo", image: "photo", otherProp: "Just a string"}
						this will render the Avatar component, passing the props
						field: rowData["photo"]		Note that the field prop is not expected in the Avatar Component, and this will trigger a Warning in console, but there's no way to know wether to pass a prop or not
						photo: rowData["photo"]		This will actually be used by Avatar
						otherProp: "Just a string"	rowData["Just a string"] is empty, so the original props value is passed on
					*/
					let otherProps = {};
					for(let f in col){
						if(componentHasProps(col.component, f)){
							otherProps[f] = col[f] != null ? (rowData[col[f]] || col[f]) : col[f];
						}
					}
					return <React.Fragment><MemoComponent id={col.field + columnOptions.rowIndex} component={col.component} {...otherProps} /></React.Fragment>
				}
			}else{
				if (col.pugTemplate) {
					//è stato definito un modello tramite pub, lo converto in un oggetto compatibile con model
					template = (rowData, columnOptions) => {
						try {

							const pugString = new Function("data", "columnOptions", col.pugTemplate)(rowData, columnOptions);
							/*
							const pugString = col.pugTemplate(
								rowData,
								columnOptions
							);*/
							const parser = new PubParser({ pugString: pugString });
							const nodes = parser.toObject();
							return generateTemplateFromNodeStructure(nodes[0]);
						} catch (e) {
							console.error(
								`Invalid pug template for column ${col.field}`,
								e
							);
						}
	
						return null;
					};
				} else if (col.nodesTemplate) {
					//converte il modello ritornato in un template
					template = (rowData, columnOptions) => {
						try {
							return generateTemplateFromNodeStructure(
								col.nodesTemplate(rowData, columnOptions)
							);
						} catch (e) {
							console.error(
								`Invalid template for column ${col.filed}`,
								e
							);
						}
						return null;
					};
				} else if (col.template) {
					template = col.template;
				} else if (col.type === "image") {
					template = imageBodyTemplate;
				}
			}

			let editor;
			switch (col.editor) {
				case "price":
					editor = (options) => priceEditor(options);
					break;
				case "integer":
					editor = (options) => integerEditor(options);
					break;
				case "text":
					editor = (options) => textEditor(options);
					break;
				default:
					editor = null;
					break;
			}

			return (
				<Column
					key={col.field}
					field={col.field}
					header={t(col.field, col.header)}
					body={template}
					sortable={col.sortable}
					referrerpolicy={col.referrerpolicy}
					editor={editor}
				/>
			);
		}) || [];
	const dynamicColumns = [...editCols, ...cols];

	return (
		<React.Fragment>
			<ContextMenu
				model={menu}
				ref={cm}
				onHide={() => setContextMenuRow(null)}
				key={props.id + "-context"}
			/>
			<PrimeDataTable
				key={props.id}
				value={list}
				paginator={props.paginator}
				rows={pageRows}
				first={pageFirst}
				paginatorTemplate={
					props.paginationType === "client"
						? paginatorTemplateClient
						: paginatorTemplateServer
				}
				sortable={props.sortable ? props.sortable.toString() : "false"}
				sortField={props.sortField}
				sortOrder={props.sortOrder}
				removableSort={props.removableSort}
				stripedRows={props.stripedRows}
				size={props.tableSize}
				responsiveLayout="scroll"
				//header={props.tableTitle}
				//filterDisplay="menu"
				filters={filters}
				header={renderFilterHeader()}
				globalFilterFields={props.globalFilterFields}
				scrollHeight={props.scrollHeight}
				editMode={props.isEditable ? props.editMode : null}
				dataKey={props.dataKey}
				onRowEditComplete={onRowEditComplete}
				emptyMessage={props.emptyMessage}
				showGridlines={props.showGridlines}
				resizableColumns={props.resizableColumns}
				columnResizeMode={props.columnResizeMode}
				selectionMode={selectionMode}
				onSelectionChange={props.events?.onSelectionChange}
				onContextMenuSelectionChange={(e) => setContextMenuRow(e.value)}
				onContextMenu={onContextMenu}
				contextMenuSelection={contextMenuRow}
			>
				{dynamicColumns}
			</PrimeDataTable>
		</React.Fragment>
	);
}
const MemoDataTable = React.memo(DataTable, (prev, next) => {
	return defaultMemoizeFunction(DataTable.propTypes, prev, next);
});
MemoDataTable.displayName = "DataTable";
DataTable.propTypes = {
	id: PropTypes.string.isRequired,
	context: PropTypes.object.isRequired,
	updatePanelContext: PropTypes.func,
	forwardData: PropTypes.any,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	panelContext: PropTypes.object.isRequired,
	columnResizeMode: PropTypes.string,
	className: PropTypes.string,
	containerClassName: PropTypes.string,
	columns: PropTypes.array,
	dataKey: PropTypes.string,
	editMode: PropTypes.string,
	emptyMessage: PropTypes.string,
	events: PropTypes.object,
	globalFilterFields: PropTypes.array,
	globalFilterMode: PropTypes.oneOf(["client", "server"]),
	setIsLoading: PropTypes.func,
	isCard: PropTypes.bool,
	isEditable: PropTypes.bool,
	isMultipleSelection: PropTypes.bool,
	pageRows: PropTypes.number,
	paginationType: PropTypes.oneOf(["client", "server"]),
	paginator: PropTypes.bool,
	panelBaseMethods: PropTypes.any,
	removableSort: PropTypes.bool,
	resizableColumns: PropTypes.bool,
	scrollHeight: PropTypes.string,
	showGridlines: PropTypes.bool,
	skeletonRow: PropTypes.number,
	sortable: PropTypes.bool,
	store: PropTypes.string,
	stripedRows: PropTypes.bool,
	tableSize: PropTypes.string,
	tableTitle: PropTypes.string,
	title: PropTypes.string,
	toggleable: PropTypes.bool,
};
export default MemoDataTable;