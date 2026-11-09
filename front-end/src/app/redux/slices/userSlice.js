import { createSlice } from "@reduxjs/toolkit";
import { registerUser, fetchClients, updateClient, deleteClient } from "../thunks/userThunks";

const initialState = {
  user: null,
  clients: [],
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearUserError: (state) => {
      state.error = null;
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
      })

      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateClient.fulfilled, (state, action) => {
        state.clients = state.clients.map((c) => (c._id === action.payload._id ? action.payload : c));
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearUserState, clearUserError } = userSlice.actions;
export default userSlice.reducer;
