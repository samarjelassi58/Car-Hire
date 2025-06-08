// app/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_API } from "../utils/api";

// Thunk de login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ Email, Password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${AUTH_API}/login`, {
        Email,
        Password,
      });
      localStorage.setItem("token", res.data.token); // Sauvegarde du token
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Thunk de logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${AUTH_API}/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
