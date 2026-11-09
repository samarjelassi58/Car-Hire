import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { MESSAGE_API, authHeaders, getErrorMessage } from "../../utils/api";

export const fetchMessages = createAsyncThunk(
  "message/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${MESSAGE_API}/getMessages`, { headers: authHeaders() });
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Impossible de charger les messages"));
    }
  }
);

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${MESSAGE_API}/addMessage`, messageData);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Envoi du message impossible"));
    }
  }
);

export const updateMessageStatus = createAsyncThunk(
  "message/updateMessageStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${MESSAGE_API}/${id}/status`, { status }, { headers: authHeaders() });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Mise à jour impossible"));
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "message/deleteMessage",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${MESSAGE_API}/${id}`, { headers: authHeaders() });
      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Suppression impossible"));
    }
  }
);
