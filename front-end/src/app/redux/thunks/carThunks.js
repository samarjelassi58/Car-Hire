import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CAR_API } from "../../utils/api";

// Upload image file
export const uploadCarImage = createAsyncThunk(
  "car/uploadCarImage",
  async (file, { rejectWithValue }) => {
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post(`${CAR_API}/uploadImage`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data; // { path }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a car
export const createCar = createAsyncThunk(
  "car/createCar",
  async (carData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${CAR_API}/createCar`, carData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get list of cars (supports query params object)
export const getCars = createAsyncThunk(
  "car/getCars",
  async (query = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(query).toString();
      const url = params ? `${CAR_API}/getCars?${params}` : `${CAR_API}/getCars`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get single car by id
export const getCarById = createAsyncThunk(
  "car/getCarById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${CAR_API}/getCar/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update car
export const updateCar = createAsyncThunk(
  "car/updateCar",
  async ({ id, update }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${CAR_API}/updateCar/${id}`, update, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete car
export const deleteCar = createAsyncThunk(
  "car/deleteCar",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${CAR_API}/deleteCar/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
