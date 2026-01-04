import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get user token helper
const getUserToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.token;
};

// Add to wishlist
export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async (tourId, { rejectWithValue }) => {
        try {
            const token = getUserToken();
            const response = await axios.post(`/api/wishlist/${tourId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { tourId, ...response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add to wishlist"
            );
        }
    }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (tourId, { rejectWithValue }) => {
        try {
            const token = getUserToken();
            const response = await axios.delete(`/api/wishlist/${tourId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { tourId, ...response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove from wishlist"
            );
        }
    }
);

// Get wishlist
export const getWishlist = createAsyncThunk(
    "wishlist/getWishlist",
    async ({ page = 1, limit = 12 } = {}, { rejectWithValue }) => {
        try {
            const token = getUserToken();
            const response = await axios.get(`/api/wishlist?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch wishlist"
            );
        }
    }
);

// Check wishlist status
export const checkWishlistStatus = createAsyncThunk(
    "wishlist/checkWishlistStatus",
    async (tourId, { rejectWithValue }) => {
        try {
            const token = getUserToken();
            const response = await axios.get(`/api/wishlist/check/${tourId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { tourId, isInWishlist: response.data.data.isInWishlist };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to check wishlist status"
            );
        }
    }
);

// Get wishlist count
export const getWishlistCount = createAsyncThunk(
    "wishlist/getWishlistCount",
    async (_, { rejectWithValue }) => {
        try {
            const token = getUserToken();
            const response = await axios.get("/api/wishlist/count", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data.count;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to get wishlist count"
            );
        }
    }
);

const initialState = {
    wishlist: [],
    wishlistStatus: {}, // { tourId: boolean }
    count: 0,
    pagination: {},
    loading: false,
    error: null
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        clearWishlistError: (state) => {
            state.error = null;
        },
        resetWishlist: (state) => {
            state.wishlist = [];
            state.wishlistStatus = {};
            state.count = 0;
            state.pagination = {};
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Add to wishlist
            .addCase(addToWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlistStatus[action.payload.tourId] = true;
                state.count += 1;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove from wishlist
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlistStatus[action.payload.tourId] = false;
                state.count = Math.max(0, state.count - 1);
                // Remove from wishlist array if it exists
                state.wishlist = state.wishlist.filter(
                    item => item.tour._id !== action.payload.tourId
                );
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get wishlist
            .addCase(getWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false;
                const { wishlist, pagination } = action.payload.data;
                
                if (pagination.currentPage === 1) {
                    state.wishlist = wishlist;
                } else {
                    state.wishlist = [...state.wishlist, ...wishlist];
                }
                
                state.pagination = pagination;
                
                // Update wishlist status
                wishlist.forEach(item => {
                    state.wishlistStatus[item.tour._id] = true;
                });
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Check wishlist status
            .addCase(checkWishlistStatus.fulfilled, (state, action) => {
                const { tourId, isInWishlist } = action.payload;
                state.wishlistStatus[tourId] = isInWishlist;
            })

            // Get wishlist count
            .addCase(getWishlistCount.fulfilled, (state, action) => {
                state.count = action.payload;
            });
    }
});

export const { clearWishlistError, resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;