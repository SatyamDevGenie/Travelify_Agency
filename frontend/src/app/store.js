import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import tourReducer from "../features/tour/tourSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tours: tourReducer,

    },
});