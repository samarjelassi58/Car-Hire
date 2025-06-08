// src/app/redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { USER_API } from "../utils/api";

// 🔁 Appel asynchrone au backend pour créer un utilisateur
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${USER_API}/createUser`, userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Erreur inconnue");
    }
  }
);

const userSlice = createSlice({
  name: "user", // anciennement "auth", changé pour refléter le contexte utilisateur
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearUserState: (state) => {
      state.user = null;
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
