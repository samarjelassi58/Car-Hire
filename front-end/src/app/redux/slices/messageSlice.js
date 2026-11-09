import { createSlice } from "@reduxjs/toolkit";
import { fetchMessages, sendMessage, updateMessageStatus, deleteMessage } from "../thunks/messageThunks";

const initialState = {
  messages: [],
  loading: false,
  error: null,
  success: false,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    clearMessageState: (state) => {
      state.messages = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearMessageFeedback: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload?.data || [];
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(updateMessageStatus.fulfilled, (state, action) => {
        state.messages = state.messages.map((m) => (m._id === action.payload._id ? action.payload : m));
      })
      .addCase(updateMessageStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter((m) => m._id !== action.payload);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessageState, clearMessageFeedback } = messageSlice.actions;
export default messageSlice.reducer;
