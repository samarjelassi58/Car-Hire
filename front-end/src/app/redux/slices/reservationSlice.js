import { createSlice } from "@reduxjs/toolkit";
import {
  createReservation,
  fetchMyReservations,
  fetchAllReservations,
  cancelReservation,
  updateReservationStatus,
} from "../thunks/reservationThunks";
import { logoutUser } from "../thunks/authThunks";

const initialState = {
  mine: [],
  all: [],
  loading: false,
  submitting: false,
  error: null,
};

const replaceById = (list, updated) => list.map((r) => (r._id === updated._id ? updated : r));

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    clearReservationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, () => initialState)

      .addCase(createReservation.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.submitting = false;
        state.mine.unshift(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      .addCase(fetchMyReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.mine = action.payload;
      })
      .addCase(fetchMyReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.mine = replaceById(state.mine, action.payload);
        state.all = replaceById(state.all, action.payload);
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        state.all = replaceById(state.all, action.payload);
      })
      .addCase(updateReservationStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearReservationError } = reservationSlice.actions;
export default reservationSlice.reducer;
