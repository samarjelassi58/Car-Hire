import { createSlice } from "@reduxjs/toolkit";
import { fetchMessages, sendMessage } from "../thunks/messageThunks";

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
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMessages.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
					.addCase(fetchMessages.fulfilled, (state, action) => {
						state.loading = false;
						// backend returns { success: true, data: messages }
						state.messages = action.payload?.data || action.payload?.messages || action.payload || [];
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
					.addCase(sendMessage.fulfilled, (state, action) => {
						state.loading = false;
						state.success = true;
						// backend returns { success: true, message: '...', data: newMessage }
						const newMsg = action.payload?.data || action.payload?.message || action.payload;
						if (newMsg && typeof newMsg === 'object') state.messages.unshift(newMsg);
					})
			.addCase(sendMessage.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				state.success = false;
			});
	},
});

export const { clearMessageState } = messageSlice.actions;
export default messageSlice.reducer;
