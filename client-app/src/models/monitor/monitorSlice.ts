import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMonitor, ISshCredentials } from "../index";
import { Monitors } from "../../api/agent";
import { mapMonitorDates } from "../../utils/index";
import { RootStateType } from "../rootReducer";

interface IMonitorState {
	loading: boolean;
	monitor: IMonitor | null;
	loadingSshCredentials: boolean;
	submittingSshCredentials: boolean;
	testingSshConnection: boolean;
	loadingRenewalScript: boolean;
	submittingRenewalScript: boolean;
}

const initialState: IMonitorState = {
	loading: false,
	monitor: null,
	loadingSshCredentials: false,
	submittingSshCredentials: false,
	testingSshConnection: false,
	loadingRenewalScript: false,
	submittingRenewalScript: false,
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

export const fetchSshCredentials = createAsyncThunk<ISshCredentials, string>(
	"monitor/fetchSshCredentials",
	async (id: string, { getState, dispatch, rejectWithValue }) => {
		const { monitor } = getState() as RootStateType;
		const credentials = monitor.monitor!.sshCredentials;
		if (credentials) {
			return credentials;
		}

		try {
			return await Monitors.getSshCredentials(id);
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const saveSshCredentials = createAsyncThunk<void, ISshCredentials>(
	"monitor/saveSshCredentials",
	async (credentials: ISshCredentials, { getState, rejectWithValue }) => {
		const {
			monitor: { monitor },
		} = getState() as RootStateType;
		try {
			await Monitors.setSshCredentials(monitor!.id, credentials);
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const testSshConnection = createAsyncThunk<boolean, ISshCredentials>(
	"monitor/testSshConnection",
	async (credentials: ISshCredentials, { getState, rejectWithValue }) => {
		const {
			monitor: { monitor },
		} = getState() as RootStateType;
		try {
			return await Monitors.testSshConnection(monitor!.id, credentials);
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const fetchRenewalScript = createAsyncThunk<string, string>(
	"monitor/fetchRenewalScript",
	async (id: string, { getState, dispatch, rejectWithValue }) => {
		const { monitor } = getState() as RootStateType;
		const script = monitor.monitor!.renewalScript;
		if (script) {
			return script;
		}

		try {
			return await Monitors.getRenewalScript(id);
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const saveRenewalScript = createAsyncThunk<void, string>(
	"monitor/saveRenewalScript",
	async (script: string, { getState, rejectWithValue }) => {
		const {
			monitor: { monitor },
		} = getState() as RootStateType;
		try {
			await Monitors.setRenewalScript(monitor!.id, script);
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

		builder.addCase(fetchSshCredentials.pending, (state) => {
			state.loadingSshCredentials = true;
		});
		builder.addCase(fetchSshCredentials.fulfilled, (state, { payload }) => {
			state.loadingSshCredentials = false;
			state.monitor!.sshCredentials = payload;
		});
		builder.addCase(fetchSshCredentials.rejected, (state) => {
			state.loadingSshCredentials = false;
		});

		builder.addCase(saveSshCredentials.pending, (state) => {
			state.submittingSshCredentials = true;
		});
		builder.addCase(saveSshCredentials.fulfilled, (state) => {
			state.submittingSshCredentials = false;
		});
		builder.addCase(saveSshCredentials.rejected, (state) => {
			state.submittingSshCredentials = false;
		});

		builder.addCase(testSshConnection.pending, (state) => {
			state.testingSshConnection = true;
		});
		builder.addCase(testSshConnection.fulfilled, (state) => {
			state.testingSshConnection = false;
		});
		builder.addCase(testSshConnection.rejected, (state) => {
			state.testingSshConnection = false;
		});

		builder.addCase(fetchRenewalScript.pending, (state) => {
			state.loadingRenewalScript = true;
		});
		builder.addCase(fetchRenewalScript.fulfilled, (state, { payload }) => {
			state.loadingRenewalScript = false;
			state.monitor!.renewalScript = payload;
		});
		builder.addCase(fetchRenewalScript.rejected, (state) => {
			state.loadingRenewalScript = false;
		});

		builder.addCase(saveRenewalScript.pending, (state) => {
			state.submittingRenewalScript = true;
		});
		builder.addCase(saveRenewalScript.fulfilled, (state) => {
			state.submittingRenewalScript = false;
		});
		builder.addCase(saveRenewalScript.rejected, (state) => {
			state.submittingRenewalScript = false;
		});
	},
});

export const { setSelectedMonitor, resetSelectedMonitor } = monitorSlice.actions;

export const { reducer: monitorReducer } = monitorSlice;
