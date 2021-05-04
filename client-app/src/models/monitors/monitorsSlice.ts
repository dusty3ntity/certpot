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

export const fetchMonitors = createAsyncThunk<IMonitor[]>("monitors/fetchMonitors", async (_, { rejectWithValue }) => {
	try {
		const response = await Monitors.list();
		return response.map(mapMonitorDates);
	} catch (err) {
		return rejectWithValue(err);
	}
});

export const createMonitor = createAsyncThunk<IMonitor, INewMonitor>(
	"monitors/createMonitor",
	async (monitor: INewMonitor, { rejectWithValue }) => {
		try {
			const response = await Monitors.create(monitor);
			return response;
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const deleteMonitor = createAsyncThunk<void, string>(
	"monitors/deleteMonitor",
	async (id: string, { dispatch, rejectWithValue }) => {
		try {
			await Monitors.delete(id);
			dispatch(removeMonitor(id));
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

const monitorsSlice = createSlice({
	name: "monitors",
	initialState,
	reducers: {
		removeMonitor: (state, action: PayloadAction<string>) => {
			state.monitors = state.monitors.filter((m) => m.id !== action.payload);
		},
		switchMonitorAutoRenewal: (state, action: PayloadAction<string>) => {
			const monitor = state.monitors.find((m) => m.id === action.payload);
			if (monitor) {
				monitor.autoRenewalEnabled = !monitor.autoRenewalEnabled;
			}
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
		});
	},
});

export const { removeMonitor, switchMonitorAutoRenewal } = monitorsSlice.actions;

export const { reducer: monitorsReducer } = monitorsSlice;
