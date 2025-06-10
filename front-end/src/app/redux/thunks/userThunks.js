import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { USER_API } from "../../utils/api";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${USER_API}/createUser`, userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Erreur inconnue");
    }
  }
);
