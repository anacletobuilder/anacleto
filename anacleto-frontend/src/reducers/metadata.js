import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	name: "",
	menu: [],
	applications: [],
	tenants: [],
};

const metadataSlice = createSlice({
	name: "metadata",
	initialState,
	reducers: {
		resetMetadata: (state = null) => {
			state = initialState;
		},
		setName: (state = null, action) => {
			state.name = action.payload;
		},
		setMenu: (state = null, action) => {
			state.menu = action.payload;
		},
		setApplications: (state = null, action) => {
			state.applications = action.payload;
		},
		setTenants: (state = null, action) => {
			state.tenants = action.payload;
		},
	}
});

export const selectMetadata = (state) => state.metadata;
export const selectName = (state) => state.metadata.name;
export const selectMenu = (state) => state.metadata.menu;
export const selectApplications = (state) => state.metadata.applications;
export const selectTenants = (state) => state.metadata.tenants;

export const { resetMetadata, setName, setMenu, setApplications, setTenants } = metadataSlice.actions;
export default metadataSlice.reducer;
