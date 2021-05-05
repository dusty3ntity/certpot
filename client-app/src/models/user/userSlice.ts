import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Users } from "../../api/agent";
import { ILoginUser, IRegisterUser, IUser, IUserPayload, IUserSettings } from "../types/users";

interface IUserState {
	loading: "idle" | "pending" | "fulfilled" | "rejected";
	submitting: boolean;
	user: IUser | null;
}

const initialState: IUserState = {
	loading: "idle",
	submitting: false,
	user: null,
};

export const loginUser = createAsyncThunk<IUserPayload, ILoginUser>(
	"user/login",
	async (credentials: ILoginUser, { rejectWithValue }) => {
		try {
			const user = await Users.login(credentials);
			return user;
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const registerUser = createAsyncThunk<IUserPayload, IRegisterUser>(
	"user/register",
	async (newUser: IRegisterUser, { rejectWithValue }) => {
		try {
			const user = await Users.register(newUser);
			return user;
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const fetchUser = createAsyncThunk<IUserPayload>("user/fetch", async (_, { rejectWithValue }) => {
	try {
		const user = await Users.current();
		return user;
	} catch (err) {
		return rejectWithValue(err);
	}
});

export const updateSettings = createAsyncThunk<void, IUserSettings>(
	"user/updateSettings",
	async (settings: IUserSettings, { dispatch, rejectWithValue }) => {
		try {
			await Users.updateSettings(settings);
			dispatch(setSettings(settings));
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			window.localStorage.removeItem("jwt");
			window.localStorage.removeItem("refreshToken");
		},
		setSettings: (state, action: PayloadAction<IUserSettings>) => {
			state.user = { ...state.user!, ...action.payload };
		},
	},
	extraReducers: (builder) => {
		builder.addCase(loginUser.pending, (state) => {
			state.submitting = true;
			state.loading = "pending";
		});
		builder.addCase(loginUser.fulfilled, (state, { payload }) => {
			state.submitting = false;
			state.loading = "fulfilled";
			state.user = payload;
			window.localStorage.setItem("jwt", payload.token);
			window.localStorage.setItem("refreshToken", payload.refreshToken);
		});
		builder.addCase(loginUser.rejected, (state) => {
			state.submitting = false;
			state.loading = "rejected";
		});

		builder.addCase(registerUser.pending, (state) => {
			state.submitting = true;
			state.loading = "pending";
		});
		builder.addCase(registerUser.fulfilled, (state, { payload }) => {
			state.submitting = false;
			state.loading = "fulfilled";
			state.user = payload;
			window.localStorage.setItem("jwt", payload.token);
			window.localStorage.setItem("refreshToken", payload.refreshToken);
		});
		builder.addCase(registerUser.rejected, (state) => {
			state.submitting = false;
			state.loading = "rejected";
		});

		builder.addCase(fetchUser.pending, (state) => {
			state.loading = "pending";
		});
		builder.addCase(fetchUser.fulfilled, (state, { payload }) => {
			state.loading = "fulfilled";
			state.user = payload;
		});
		builder.addCase(fetchUser.rejected, (state) => {
			state.loading = "rejected";
		});

		builder.addCase(updateSettings.pending, (state) => {
			state.submitting = true;
		});
		builder.addCase(updateSettings.fulfilled, (state, { payload }) => {
			state.submitting = false;
		});
		builder.addCase(updateSettings.rejected, (state) => {
			state.submitting = false;
		});
	},
});

export const { logout, setSettings } = userSlice.actions;

export const { reducer: userReducer } = userSlice;
