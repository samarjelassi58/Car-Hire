// src/app/redux/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AUTH_API } from "../../utils/api";

// 🔐 Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ Email, Password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${AUTH_API}/login`, {
        Email,
        Password,
      });
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// 🚪 Logout
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

export const loadUserFromToken = createAsyncThunk(
  "auth/loadUserFromToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${AUTH_API}/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { user: response.data.user };
    } catch (err) {
      return rejectWithValue("Failed to load user");
    }
  }
);
