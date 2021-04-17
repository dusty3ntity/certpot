import { combineReducers } from "redux";

import { monitorReducer } from "./monitor/monitorSlice";
import { monitorsReducer } from "./monitors/monitorsSlice";
import { userReducer } from "./user/userSlice";

export const rootReducer = combineReducers({
	monitors: monitorsReducer,
	monitor: monitorReducer,
	user: userReducer,
});

export type RootStateType = ReturnType<typeof rootReducer>;
