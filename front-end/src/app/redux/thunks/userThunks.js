import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { USER_API, authHeaders, getErrorMessage } from "../../utils/api";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${USER_API}/createUser`, userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Inscription impossible"));
    }
  }
);

export const fetchClients = createAsyncThunk(
  "user/fetchClients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(USER_API, { headers: authHeaders() });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Impossible de charger les clients"));
    }
  }
);

export const updateClient = createAsyncThunk(
  "user/updateClient",
  async ({ id, update }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${USER_API}/${id}`, update, { headers: authHeaders() });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Mise à jour impossible"));
    }
  }
);

export const deleteClient = createAsyncThunk(
  "user/deleteClient",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${USER_API}/${id}`, { headers: authHeaders() });
      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Suppression impossible"));
    }
  }
);
