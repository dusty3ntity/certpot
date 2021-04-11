import { combineReducers } from "redux";

import { monitorReducer } from "./monitor/monitorSlice";
import { monitorsReducer } from "./monitors/monitorsSlice";

export const rootReducer = combineReducers({
	monitors: monitorsReducer,
	monitor: monitorReducer,
});

export type RootStateType = ReturnType<typeof rootReducer>;
