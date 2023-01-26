import React, { useState, useRef, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { Avatar } from "primereact/avatar";
import Logo from "../../img/anacleto.png";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";

//STYLE
import { classNames } from "primereact/utils";
import { useDispatch, useSelector } from "react-redux";
import { selectTenant, setTenant } from "../../reducers/context";
import { selectMenu } from "../../reducers/metadata";
import { getFunctionFromMetadata } from "../../utils/utils"

const recurseParseMenuFunctions = (menuArray) => {
	return menuArray.map((e) => {
		if(e.command){
			e.command = getFunctionFromMetadata(e.command);
		}else if(e.components){
			return {
				...e,
				items: recurseParseMenuFunctions(e.components)
			};
		}
		return e;
	})
}
function TopBar(props) {
	const dispatch = useDispatch();
	const tenant = useSelector(selectTenant);

	//"_menu" will be the non-parsed menu (with stringified commands), while "menu" will be the parsed one (with function commands)
	const _menu = useSelector(selectMenu);
	const [menu, setMenu] = useState([]);
	
	useEffect(() => {
		setMenu(recurseParseMenuFunctions(JSON.parse(JSON.stringify(_menu))));
	}, [_menu]);

	const menuRef = useRef(null);
	const [theme, setTheme] = useState(props.theme || "light");

	const handleLogout = () => {
		props.logout();
	};

	const getMenubarStart = () => {
		if (props.metadata?.appLogo) {
			return (
				<img
					alt="logo"
					src={process.env.PUBLIC_URL + props.metadata.appLogo}
					onError={console.error}
					height="40"
					className="mr-2"
				></img>
			);
		}

		return (
			<img
				alt="logo"
				src={Logo}
				onError={console.error}
				height="40"
				className="mr-2"
			></img>
		);
	};

	const getThemeSwitcher = () => {
		if (false) {
			const themeOptions = [
				{ name: "Light", value: "light" },
				{ name: "Dark", value: "dark" },
			];
			return (
				<div
					className="flex flex-row flex-wrap gap-3 mt-3 pt-3 border-top-1 border-300 justify-content-center align-items-center"
					style={{ gap: "1rem" }}
				>
					<h4>Theme</h4>
					<SelectButton
						value={theme}
						options={themeOptions}
						optionLabel="name"
						onChange={(e) => {
							setTheme(e.value);
							props.changeTheme(e.value);
						}}
					/>
				</div>
			);
		} else {
			return null;
		}
	};

	const getMenubarEnd = () => {
		const changeTenant = (event) => {
			dispatch(setTenant(event.value));
			if(props.changeTenant){
				props.changeTenant(event.value);
			}
		};

		return (
			<div className={classNames("flex")}>
				<Dropdown
					optionLabel="description"
					optionValue="tenant"
					value={tenant}
					options={props.tenants}
					onChange={changeTenant}
					placeholder="Select a tenant"
					className={classNames("mr-3")}
				/>
				<Avatar
					referrerPolicy="no-referrer"
					image={
						props.userCredentials?.claims?.picture ||
						`${process.env.PUBLIC_URL}/user.svg`
					}
					size="large"
					shape="circle"
					onClick={(event) => menuRef.current.toggle(event)}
				/>
				<OverlayPanel dismissable ref={menuRef}>
					<div className="flex flex-column align-items-center justify-content-center mt-3">
						<div className="flex flex-1">
							<Avatar
								size="xlarge"
								shape="circle"
								image={
									props.userCredentials?.claims?.picture ||
									`${process.env.PUBLIC_URL}/user.svg`
								}
							/>
						</div>
						<div className="flex flex-1 pr-2 pl-2 mt-2 text-base text-500">
							{props.userCredentials?.claims?.name}
						</div>
						<div className="flex flex-1 pr-2 pl-2 text-sm text-500">
							{props.userCredentials?.username}
						</div>
					</div>
					<React.Fragment>{getThemeSwitcher()}</React.Fragment>
					<div
						className="flex flex-row flex-wrap gap-3 mt-3 pt-3 border-top-1 border-300 justify-content-center"
						style={{ gap: "1rem" }}
					>
						{props.applications.map((app) => {
							let selectClass = "";
							if (
								(props.application === "BUILDER" &&
									props.destApplication ===
										app.application) ||
								props.application === app.application
							) {
								selectClass = "p-highlight";
							}

							return (
								<Button
									key={app.application}
									label={app.description}
									icon="pi pi-microsoft"
									iconPos="top"
									className={classNames(
										"app-button",
										"p-button-text",
										selectClass
									)}
									onClick={(event) => {
										props.changeApp(app.application);
										menuRef.current.toggle(event);
									}}
								/>
							);
						})}
					</div>
					<div className="flex flex-column align-items-center justify-content-center mt-4 border-top-1 border-300">
						<Button
							label="Logout"
							icon="pi pi-fw pi-power-off"
							iconPos="left"
							className={classNames(
								"flex",
								"flex-1",
								"p-button-text",
								"p-button-secondary",
								"mt-3"
							)}
							onClick={(event) => {
								handleLogout();
							}}
						/>
					</div>
				</OverlayPanel>
			</div>
		);
	};

	return (
		<Menubar
			className={classNames("layout-topbar", "bg-primary-reverse fixed h-5rem z-5 left-0 top-0 w-full px-5 flex align-items-center shadow-1 justify-content-between")}
			model={menu}
			start={getMenubarStart}
			end={getMenubarEnd}
		/>
	);
}

TopBar.whyDidYouRender = false;
export default TopBar;