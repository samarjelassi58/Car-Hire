import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CAR_API, authHeaders, getErrorMessage } from "../../utils/api";

const wrap = (fn, fallback) => async (arg, { rejectWithValue }) => {
  try {
    return await fn(arg);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, fallback));
  }
};

export const uploadCarImage = createAsyncThunk(
  "car/uploadCarImage",
  wrap(async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await axios.post(`${CAR_API}/uploadImage`, fd, { headers: authHeaders() });
    return res.data; // { path }
  }, "Échec de l'envoi de l'image")
);

export const createCar = createAsyncThunk(
  "car/createCar",
  wrap(async (carData) => {
    const res = await axios.post(`${CAR_API}/createCar`, carData, { headers: authHeaders() });
    return res.data;
  }, "Création impossible")
);

export const getCars = createAsyncThunk(
  "car/getCars",
  wrap(async (query = {}) => {
    const res = await axios.get(`${CAR_API}/getCars`, { params: query });
    return res.data;
  }, "Impossible de charger les voitures")
);

export const getCarById = createAsyncThunk(
  "car/getCarById",
  wrap(async (id) => {
    const res = await axios.get(`${CAR_API}/getCar/${id}`);
    return res.data;
  }, "Voiture introuvable")
);

export const updateCar = createAsyncThunk(
  "car/updateCar",
  wrap(async ({ id, update }) => {
    const res = await axios.put(`${CAR_API}/updateCar/${id}`, update, { headers: authHeaders() });
    return res.data;
  }, "Mise à jour impossible")
);

export const deleteCar = createAsyncThunk(
  "car/deleteCar",
  wrap(async (id) => {
    const res = await axios.delete(`${CAR_API}/deleteCar/${id}`, { headers: authHeaders() });
    return res.data;
  }, "Suppression impossible")
);
