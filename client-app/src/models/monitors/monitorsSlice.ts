import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMonitor } from "../index";
import { Monitors } from "../../api/agent";
import { mapMonitorDates } from "../../utils/index";
import { INewMonitor } from "../types";

interface IMonitorsState {
	loading: boolean;
	deleting: boolean;
	deleteTargetId: string | null;
	submitting: boolean;
	monitors: IMonitor[];
}

const initialState: IMonitorsState = {
	loading: false,
	deleting: false,
	deleteTargetId: null,
	submitting: false,
	monitors: [],
};

export const fetchMonitors = createAsyncThunk<IMonitor[]>("monitors/fetchMonitors", async () => {
	const response = await Monitors.list();
	return response.map(mapMonitorDates);
});

export const createMonitor = createAsyncThunk<IMonitor, INewMonitor>(
	"monitors/createMonitor",
	async (monitor: INewMonitor) => {
		const response = await Monitors.create(monitor);
		return response;
	}
);

export const deleteMonitor = createAsyncThunk<void, string>(
	"monitors/deleteMonitor",
	async (id: string, { dispatch }) => {
		await Monitors.delete(id);
		dispatch(removeMonitor(id));
	}
);

const monitorsSlice = createSlice({
	name: "monitors",
	initialState,
	reducers: {
		removeMonitor: (state, action: PayloadAction<string>) => {
			state.monitors = state.monitors.filter((m) => m.id !== action.payload);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchMonitors.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchMonitors.fulfilled, (state, { payload }) => {
			state.loading = false;
			state.monitors = payload;
		});
		builder.addCase(fetchMonitors.rejected, (state, { error }) => {
			state.loading = false;
			console.log(error);
		});

		builder.addCase(deleteMonitor.pending, (state, { meta }) => {
			state.deleting = true;
			state.deleteTargetId = meta.arg;
		});
		builder.addCase(deleteMonitor.fulfilled, (state) => {
			state.deleting = false;
			state.deleteTargetId = null;
		});
		builder.addCase(deleteMonitor.rejected, (state, { error }) => {
			state.deleting = false;
			state.deleteTargetId = null;
			console.log(error);
		});

		builder.addCase(createMonitor.pending, (state) => {
			state.submitting = true;
		});
		builder.addCase(createMonitor.fulfilled, (state, { payload }) => {
			state.submitting = false;
			state.monitors.push(payload);
		});
		builder.addCase(createMonitor.rejected, (state, { error }) => {
			state.submitting = false;
			console.log(error);
		});
	},
});

const { removeMonitor } = monitorsSlice.actions;

export const { reducer: monitorsReducer } = monitorsSlice;
