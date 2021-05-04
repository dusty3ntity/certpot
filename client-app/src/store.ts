import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { rootReducer } from "./models/rootReducer";

export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware({
		serializableCheck: false,
	}),
});

export type AppDispatchType = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatchType>();
