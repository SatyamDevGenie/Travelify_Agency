import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_URL = "http://localhost:5000/api/bookings";

// Get token from localStorage
const getAuthToken = () => {
    try {
        const user = localStorage.getItem("user");
        if (user) {
            const parsed = JSON.parse(user);
            return parsed.token || null;
        }
    } catch (error) {
        console.error("Error getting auth token:", error);
    }
    return null;
};

// Create axios instance with auth header
const axiosWithAuth = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add token to every request
axiosWithAuth.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("No auth token found in localStorage");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ===============================
// 🔹 ASYNC THUNKS
// ===============================

// Create Razorpay order
export const createBookingOrder = createAsyncThunk(
    "booking/createOrder",
    async (orderData, thunkAPI) => {
        try {
            // Get token fresh from localStorage
            const token = getAuthToken();
            if (!token) {
                return thunkAPI.rejectWithValue("Please login to book a tour");
            }

            const response = await axiosWithAuth.post("/create-order", orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Error creating order";
            console.error("Booking order error:", errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// Verify payment and create booking
export const verifyPaymentAndBook = createAsyncThunk(
    "booking/verifyPayment",
    async (paymentData, thunkAPI) => {
        try {
            // Get token fresh from localStorage
            const token = getAuthToken();
            if (!token) {
                return thunkAPI.rejectWithValue("Please login to complete booking");
            }

            const response = await axiosWithAuth.post("/verify-payment", paymentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Error verifying payment";
            console.error("Payment verification error:", errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// Get user's bookings
export const fetchMyBookings = createAsyncThunk(
    "booking/fetchMyBookings",
    async (_, thunkAPI) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return thunkAPI.rejectWithValue("Please login to view bookings");
            }

            const response = await axiosWithAuth.get("/my-bookings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Error fetching bookings"
            );
        }
    }
);

// Get all bookings (Admin)
export const fetchAllBookings = createAsyncThunk(
    "booking/fetchAllBookings",
    async (_, thunkAPI) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return thunkAPI.rejectWithValue("Please login");
            }

            const response = await axiosWithAuth.get("/all/bookings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Error fetching all bookings"
            );
        }
    }
);

// Get single booking by ID
export const fetchBookingById = createAsyncThunk(
    "booking/fetchBookingById",
    async (bookingId, thunkAPI) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return thunkAPI.rejectWithValue("Please login");
            }

            const response = await axiosWithAuth.get(`/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Error fetching booking"
            );
        }
    }
);

// Confirm booking (Admin)
export const confirmBooking = createAsyncThunk(
    "booking/confirmBooking",
    async (bookingId, thunkAPI) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return thunkAPI.rejectWithValue("Please login");
            }

            const response = await axiosWithAuth.put(`/${bookingId}/confirm`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Error confirming booking"
            );
        }
    }
);

// Cancel booking (Admin)
export const cancelBooking = createAsyncThunk(
    "booking/cancelBooking",
    async (bookingId, thunkAPI) => {
        try {
            const response = await axiosWithAuth.put(`/${bookingId}/cancel`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Error cancelling booking"
            );
        }
    }
);

// ===============================
// 🔹 SLICE
// ===============================
const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        order: null,
        bookings: [],
        allBookings: [],
        singleBooking: null,
        loading: false,
        orderLoading: false,
        error: null,
        orderError: null,
    },
    reducers: {
        clearOrder: (state) => {
            state.order = null;
            state.orderError = null;
        },
        clearError: (state) => {
            state.error = null;
            state.orderError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createBookingOrder.pending, (state) => {
                state.orderLoading = true;
                state.orderError = null;
            })
            .addCase(createBookingOrder.fulfilled, (state, action) => {
                state.orderLoading = false;
                state.order = action.payload;
            })
            .addCase(createBookingOrder.rejected, (state, action) => {
                state.orderLoading = false;
                state.orderError = action.payload;
            })

            // Verify Payment
            .addCase(verifyPaymentAndBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyPaymentAndBook.fulfilled, (state, action) => {
                state.loading = false;
                state.order = null;
                // Refresh bookings list
            })
            .addCase(verifyPaymentAndBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch My Bookings
            .addCase(fetchMyBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload.bookings || [];
            })
            .addCase(fetchMyBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch All Bookings
            .addCase(fetchAllBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.allBookings = action.payload.bookings || [];
            })
            .addCase(fetchAllBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Booking By ID
            .addCase(fetchBookingById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookingById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleBooking = action.payload.booking;
            })
            .addCase(fetchBookingById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Confirm Booking
            .addCase(confirmBooking.fulfilled, (state, action) => {
                const index = state.allBookings.findIndex(
                    (b) => b._id === action.payload.booking._id
                );
                if (index !== -1) {
                    state.allBookings[index] = action.payload.booking;
                }
            })

            // Cancel Booking
            .addCase(cancelBooking.fulfilled, (state, action) => {
                const index = state.allBookings.findIndex(
                    (b) => b._id === action.payload.booking._id
                );
                if (index !== -1) {
                    state.allBookings[index] = action.payload.booking;
                }
            });
    },
});

export const { clearOrder, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;

