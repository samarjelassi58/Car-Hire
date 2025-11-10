import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { MESSAGE_API } from "../../utils/api";

// Fetch all messages (admin view)
export const fetchMessages = createAsyncThunk(
	"message/fetchMessages",
	async (_, { rejectWithValue }) => {
		try {
			const token = localStorage.getItem("token");
			const headers = token ? { Authorization: `Bearer ${token}` } : {};
			const res = await axios.get(`${MESSAGE_API}/getMessages`, { headers });
			return res.data; // expect { success: true, data: [...] } or array
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || "Failed to fetch messages");
		}
	}
);

// Send a new message (contact us)
export const sendMessage = createAsyncThunk(
	"message/sendMessage",
	async (messageData, { rejectWithValue }) => {
		try {
			const res = await axios.post(`${MESSAGE_API}/addMessage`, messageData);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || "Failed to send message");
		}
	}
);
