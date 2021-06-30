import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Users } from "../../api/agent";
import {
	IEditUserSecret,
	ILoginUser,
	INewUserSecret,
	IRegisterUser,
	IUser,
	IUserPayload,
	IUserSecret,
	IUserSettings,
} from "../types/users";

interface IUserState {
	loading: "idle" | "pending" | "fulfilled" | "rejected";
	submitting: boolean;
	user: IUser | null;
	secrets?: IUserSecret[];
	loadingSecrets: boolean;
	creatingSecret: boolean;
	editingSecret: boolean;
	editingSecretId: string | null;
	deletingSecret: boolean;
	deletingSecretId: string | null;
}

const initialState: IUserState = {
	loading: "idle",
	submitting: false,
	user: null,
	loadingSecrets: false,
	creatingSecret: false,
	editingSecret: false,
	editingSecretId: null,
	deletingSecret: false,
	deletingSecretId: null,
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

export const fetchSecrets = createAsyncThunk<IUserSecret[]>("user/fetchSecrets", async (_, { rejectWithValue }) => {
	try {
		return await Users.secretsList();
	} catch (err) {
		return rejectWithValue(err);
	}
});

export const createSecret = createAsyncThunk<IUserSecret, INewUserSecret>(
	"user/createSecret",
	async (secret: INewUserSecret, { rejectWithValue }) => {
		try {
			return await Users.createSecret(secret);
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const editSecret = createAsyncThunk<void, { id: string; secret: IEditUserSecret }>(
	"user/editSecret",
	async (data, { rejectWithValue }) => {
		try {
			await Users.editSecret(data.id, data.secret);
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const deleteSecret = createAsyncThunk<void, string>(
	"user/deleteSecret",
	async (id: string, { dispatch, rejectWithValue }) => {
		try {
			await Users.deleteSecret(id);
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

		builder.addCase(fetchSecrets.pending, (state) => {
			state.loadingSecrets = true;
		});
		builder.addCase(fetchSecrets.fulfilled, (state, { payload }) => {
			state.loadingSecrets = false;
			state.secrets = payload;
		});
		builder.addCase(fetchSecrets.rejected, (state) => {
			state.loadingSecrets = false;
		});

		builder.addCase(createSecret.pending, (state) => {
			state.creatingSecret = true;
		});
		builder.addCase(createSecret.fulfilled, (state, { payload }) => {
			state.creatingSecret = false;
			state.secrets!.push(payload);
		});
		builder.addCase(createSecret.rejected, (state) => {
			state.creatingSecret = false;
		});

		builder.addCase(editSecret.pending, (state, { meta }) => {
			state.editingSecret = true;
			state.editingSecretId = meta.arg.id;
		});
		builder.addCase(editSecret.fulfilled, (state) => {
			state.editingSecret = false;
			state.editingSecretId = null;
		});
		builder.addCase(editSecret.rejected, (state) => {
			state.editingSecret = false;
			state.editingSecretId = null;
		});

		builder.addCase(deleteSecret.pending, (state, { meta }) => {
			state.deletingSecret = true;
			state.deletingSecretId = meta.arg;
		});
		builder.addCase(deleteSecret.fulfilled, (state) => {
			state.deletingSecret = false;
			state.deletingSecretId = null;
		});
		builder.addCase(deleteSecret.rejected, (state) => {
			state.deletingSecret = false;
			state.deletingSecretId = null;
		});
	},
});

export const { logout, setSettings } = userSlice.actions;

export const { reducer: userReducer } = userSlice;
