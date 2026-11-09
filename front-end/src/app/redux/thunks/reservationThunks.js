import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RESERVATION_API, authHeaders, getErrorMessage } from "../../utils/api";

const request = (fn, fallback) => async (arg, { rejectWithValue }) => {
  try {
    return await fn(arg);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, fallback));
  }
};

export const createReservation = createAsyncThunk(
  "reservation/create",
  request(async ({ carId, startDate, endDate }) => {
    const res = await axios.post(RESERVATION_API, { carId, startDate, endDate }, { headers: authHeaders() });
    return res.data.data;
  }, "Réservation impossible")
);

export const fetchMyReservations = createAsyncThunk(
  "reservation/fetchMine",
  request(async () => {
    const res = await axios.get(`${RESERVATION_API}/my`, { headers: authHeaders() });
    return res.data.data;
  }, "Impossible de charger vos réservations")
);

export const fetchAllReservations = createAsyncThunk(
  "reservation/fetchAll",
  request(async (status) => {
    const res = await axios.get(RESERVATION_API, {
      headers: authHeaders(),
      params: status ? { status } : {},
    });
    return res.data.data;
  }, "Impossible de charger les réservations")
);

export const cancelReservation = createAsyncThunk(
  "reservation/cancel",
  request(async (id) => {
    const res = await axios.delete(`${RESERVATION_API}/${id}`, { headers: authHeaders() });
    return res.data.data;
  }, "Annulation impossible")
);

export const updateReservationStatus = createAsyncThunk(
  "reservation/updateStatus",
  request(async ({ id, status }) => {
    const res = await axios.patch(`${RESERVATION_API}/${id}/status`, { status }, { headers: authHeaders() });
    return res.data.data;
  }, "Mise à jour impossible")
);
