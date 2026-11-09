import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AUTH_API, authHeaders, getErrorMessage } from "../../utils/api";

export const SESSION_EXPIRED = "Session expirée";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ Email, Password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${AUTH_API}/login`, { Email, Password });
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Connexion impossible"));
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await axios.post(`${AUTH_API}/logout`, null, { headers: authHeaders() });
  } finally {
    // La session locale est toujours supprimée, même si l'API est injoignable.
    localStorage.removeItem("token");
  }
});

export const loadUserFromToken = createAsyncThunk(
  "auth/loadUserFromToken",
  async (_, { rejectWithValue }) => {
    if (!localStorage.getItem("token")) return rejectWithValue(SESSION_EXPIRED);
    try {
      const res = await axios.get(`${AUTH_API}/verify`, { headers: authHeaders() });
      return { user: res.data.user };
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        return rejectWithValue(SESSION_EXPIRED);
      }
      return rejectWithValue(getErrorMessage(err));
    }
  }
);
