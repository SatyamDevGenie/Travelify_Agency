import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_URL = "http://localhost:5000/api/bookings";

// Get token from localStorage or Redux state
const getAuthToken = (getState) => {
    try {
        // First try to get from localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const parsed = JSON.parse(userStr);
            if (parsed.token) {
                return parsed.token;
            }
        }
        
        // Fallback: try to get from Redux state if available
        if (getState) {
            const state = getState();
            const user = state?.auth?.user;
            if (user?.token) {
                return user.token;
            }
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
            // Get token fresh from localStorage or Redux
            const token = getAuthToken(thunkAPI.getState);
            if (!token) {
                return thunkAPI.rejectWithValue("Please login to book a tour");
            }

            const response = await axios.post(`${API_URL}/create-order`, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            // Get detailed error message
            let errorMessage = "Error creating order";
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            // Log full error for debugging
            console.error("Booking order error:", {
                message: errorMessage,
                status: error.response?.status,
                data: error.response?.data,
                fullError: error
            });
            
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// Verify payment and create booking
export const verifyPaymentAndBook = createAsyncThunk(
    "booking/verifyPayment",
    async (paymentData, thunkAPI) => {
        try {
            // Get token fresh from localStorage or Redux
            const token = getAuthToken(thunkAPI.getState);
            if (!token) {
                return thunkAPI.rejectWithValue("Please login to complete booking");
            }

            const response = await axios.post(`${API_URL}/verify-payment`, paymentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
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

// Create direct booking without payment
export const createDirectBooking = createAsyncThunk(
    "booking/createDirectBooking",
    async (bookingData, thunkAPI) => {
        try {
            // Get token fresh from localStorage or Redux
            const token = getAuthToken(thunkAPI.getState);
            if (!token) {
                return thunkAPI.rejectWithValue("Please login to book a tour");
            }

            const response = await axios.post(`${API_URL}/direct-booking`, bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Error creating booking";
            console.error("Direct booking error:", errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// Get user's bookings
export const fetchMyBookings = createAsyncThunk(
    "booking/fetchMyBookings",
    async (_, thunkAPI) => {
        try {
            const token = getAuthToken(thunkAPI.getState);
            if (!token) {
                return thunkAPI.rejectWithValue("Please login to view bookings");
            }

            const response = await axios.get(`${API_URL}/my-bookings`, {
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
            const token = getAuthToken(thunkAPI.getState);
            if (!token) {
                return thunkAPI.rejectWithValue("Please login");
            }

            const response = await axios.get(`${API_URL}/all/bookings`, {
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
            const token = getAuthToken(thunkAPI.getState);
            if (!token) {
                return thunkAPI.rejectWithValue("Please login");
            }

            const response = await axios.get(`${API_URL}/${bookingId}`, {
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
            const token = getAuthToken(thunkAPI.getState);
            if (!token) {
                return thunkAPI.rejectWithValue("Please login");
            }

            const response = await axios.put(`${API_URL}/${bookingId}/confirm`, {}, {
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
    async ({ bookingId, rejectionReason }, thunkAPI) => {
        try {
            const token = getAuthToken(thunkAPI.getState);
            if (!token) {
                return thunkAPI.rejectWithValue("Please login");
            }

            const response = await axios.put(`${API_URL}/${bookingId}/cancel`, 
                { rejectionReason }, // Send rejection reason in request body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
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
                // Add new booking to the list
                if (action.payload?.booking) {
                    state.bookings.unshift(action.payload.booking);
                }
            })
            .addCase(verifyPaymentAndBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Direct Booking
            .addCase(createDirectBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDirectBooking.fulfilled, (state, action) => {
                state.loading = false;
                // Add new booking to the list
                if (action.payload?.booking) {
                    state.bookings.unshift(action.payload.booking);
                }
            })
            .addCase(createDirectBooking.rejected, (state, action) => {
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

