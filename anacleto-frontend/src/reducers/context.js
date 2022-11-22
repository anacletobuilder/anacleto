import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	application: null,
	destApplication: null,
	tenant: null,
	userCredentials: {},
	window: null
};

const contextSlice = createSlice({
	name: "context",
	initialState,
	reducers: {
		resetContext: (state = null) => {
			state = initialState;
		},
		setApplication: (state = null, action) => {
			state.application = action.payload;
		},
		setDestApplication: (state = null, action) => {
			state.destApplication = action.payload;
		},
		setTenant: (state = null, action) => {
			state.tenant = action.payload;
		},
		setUserCredentials: (state = null, action) => {
			state.userCredentials = action.payload;
		},
		setWindow: (state = null, action) => {
			state.window = action.payload;
		},
	}
});

export const selectContext = (state) => state.context;
export const selectApplication = (state) => state.context.application;
export const selectDestApplication = (state) => state.context.destApplication;
export const selectTenant = (state) => state.context.tenant;
export const selectUserCredentials = (state) => state.context.userCredentials;
export const selectWindow = (state) => state.context.window;

export const { resetContext, setApplication, setDestApplication, setTenant, setUserCredentials, setWindow} = contextSlice.actions;
export default contextSlice.reducer;
