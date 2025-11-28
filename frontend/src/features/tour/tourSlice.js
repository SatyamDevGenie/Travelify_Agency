import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_URL = "https://travelify-agency.onrender.com/api/tours";

// ===============================
// 🔹 FETCH ALL TOURS
// ===============================
export const fetchTours = createAsyncThunk(
    "tours/fetchTours",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch tours"
            );
        }
    }
);

// ===============================
// 🔹 CREATE TOUR
// ===============================
export const createTour = createAsyncThunk(
    "tours/createTour",
    async (tourData, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.user?.token;
            if (!token) return rejectWithValue("Unauthorized: No token found");

            const formData = new FormData();
            formData.append("title", tourData.title);
            formData.append("description", tourData.description);
            formData.append("price", tourData.price);
            formData.append("location", tourData.location);
            formData.append("availableSlots", tourData.availableSlots);

            // ✅ Append missing fields
            formData.append("category", tourData.category);
            formData.append("subcategory", tourData.subcategory);

            if (tourData.image) formData.append("image", tourData.image);

            const res = await axios.post(`${API_URL}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create tour"
            );
        }
    }
);



// ===============================
// 🔹 UPDATE TOUR
// ===============================
export const updateTour = createAsyncThunk(
    "tours/updateTour",
    async ({ id, updatedData }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.user?.token;
            if (!token) return rejectWithValue("Unauthorized: No token found");

            // If updatedData is FormData (with image), we use it directly
            // Otherwise, we convert price & availableSlots to numbers
            let payload;
            if (updatedData instanceof FormData) {
                payload = updatedData;
            } else {
                payload = {
                    ...updatedData,
                    price: Number(updatedData.price),
                    availableSlots: Number(updatedData.availableSlots),
                };
            }

            const { data } = await axios.put(`${API_URL}/${id}`, payload, {
                headers: {
                    "Content-Type": updatedData instanceof FormData ? "multipart/form-data" : "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update tour"
            );
        }
    }
);



// ===============================
// 🔹 DELETE TOUR
// ===============================
export const deleteTour = createAsyncThunk(
    "tours/deleteTour",
    async (id, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.user?.token;
            if (!token) return rejectWithValue("Unauthorized: No token found");

            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete tour"
            );
        }
    }
);

// ===============================
// 🔹 FETCH SINGLE TOUR BY ID
// ===============================
export const fetchTourById = createAsyncThunk(
    "tours/fetchTourById",
    async (tourId, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/${tourId}`);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch tour details"
            );
        }
    }
);

// ===============================
// 🔹 SLICE
// ===============================
const tourSlice = createSlice({
    name: "tours",
    initialState: {
        tours: [],
        singleTour: null,
        loading: false,
        singleLoading: false,
        error: null,
        singleError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH ALL
            .addCase(fetchTours.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTours.fulfilled, (state, action) => {
                state.loading = false;
                state.tours = action.payload;
            })
            .addCase(fetchTours.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // FETCH SINGLE
            .addCase(fetchTourById.pending, (state) => {
                state.singleLoading = true;
                state.singleError = null;
                state.singleTour = null;
            })
            .addCase(fetchTourById.fulfilled, (state, action) => {
                state.singleLoading = false;
                state.singleTour = action.payload;
            })
            .addCase(fetchTourById.rejected, (state, action) => {
                state.singleLoading = false;
                state.singleError = action.payload;
            })

            // CREATE
            .addCase(createTour.fulfilled, (state, action) => {
                state.tours.push(action.payload);
            })

            // UPDATE
            .addCase(updateTour.fulfilled, (state, action) => {
                state.tours = state.tours.map((tour) =>
                    tour._id === action.payload._id ? action.payload : tour
                );
                if (state.singleTour?._id === action.payload._id) {
                    state.singleTour = action.payload;
                }
            })

            // DELETE
            .addCase(deleteTour.fulfilled, (state, action) => {
                state.tours = state.tours.filter((tour) => tour._id !== action.payload);
                if (state.singleTour?._id === action.payload) {
                    state.singleTour = null;
                }
            });
    },
});

export default tourSlice.reducer;



