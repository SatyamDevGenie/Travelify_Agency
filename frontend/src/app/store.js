import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import tourReducer from "../features/tour/tourSlice";
import bookingReducer from "../features/booking/bookingSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tours: tourReducer,
        booking: bookingReducer,
        wishlist: wishlistReducer,
    },
});