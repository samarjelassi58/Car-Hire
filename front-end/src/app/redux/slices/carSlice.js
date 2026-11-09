import { createSlice } from "@reduxjs/toolkit";
import { createCar, getCars, getCarById, updateCar, deleteCar } from "../thunks/carThunks";

const initialState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    clearCarError: (state) => {
      state.error = null;
    },
    clearCurrentCar: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createCar
      .addCase(createCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getCars
      .addCase(getCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCars.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getCarById
      .addCase(getCarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCarById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getCarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateCar
      .addCase(updateCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.list = state.list.map((c) => (c._id === updated._id ? updated : c));
        if (state.current && state.current._id === updated._id) state.current = updated;
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteCar
      .addCase(deleteCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload.id || action.payload._id || action.meta.arg;
        state.list = state.list.filter((c) => c._id !== id);
        if (state.current && state.current._id === id) state.current = null;
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCarError, clearCurrentCar } = carSlice.actions;
export default carSlice.reducer;
