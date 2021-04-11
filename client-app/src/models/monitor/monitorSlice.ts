import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMonitor } from "../index";
import { Monitors } from "../../api/agent";
import { mapMonitorDates } from "../../utils/index";
import { RootStateType } from "../rootReducer";

interface IMonitorState {
	loading: boolean;
	monitor: IMonitor | null;
}

const initialState: IMonitorState = {
	loading: false,
	monitor: null,
};

export const fetchMonitorById = createAsyncThunk<IMonitor, string>(
	"monitor/fetchMonitor",
	async (id: string, { getState, dispatch, rejectWithValue }) => {
		const {
			monitors: { monitors },
		} = getState() as RootStateType;
		const monitor = monitors.find((m) => m.id === id);
		if (monitor) {
			dispatch(setSelectedMonitor(monitor));
			return monitor;
		}

		try {
			const response = await Monitors.details(id);
			return mapMonitorDates(response);
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

const monitorSlice = createSlice({
	name: "monitor",
	initialState,
	reducers: {
		setSelectedMonitor: (state, action: PayloadAction<IMonitor>) => {
			state.monitor = action.payload;
		},
		resetSelectedMonitor: (state) => {
			state.monitor = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchMonitorById.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchMonitorById.fulfilled, (state, { payload }) => {
			state.loading = false;
			state.monitor = payload;
		});
		builder.addCase(fetchMonitorById.rejected, (state) => {
			state.loading = false;
		});
	},
});

export const { setSelectedMonitor, resetSelectedMonitor } = monitorSlice.actions;

export const { reducer: monitorReducer } = monitorSlice;
