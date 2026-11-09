import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser, loadUserFromToken, SESSION_EXPIRED } from "../thunks/authThunks";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const clearSession = (state) => {
  state.user = null;
  state.token = null;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(logoutUser.fulfilled, (state) => {
        clearSession(state);
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        clearSession(state);
        state.loading = false;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = localStorage.getItem("token");
      })
      .addCase(loadUserFromToken.rejected, (state, action) => {
        // Une panne réseau ne doit pas déconnecter l'utilisateur.
        if (action.payload === SESSION_EXPIRED) clearSession(state);
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
