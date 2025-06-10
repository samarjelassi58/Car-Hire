import { createSlice } from "@reduxjs/toolkit";
import { registerUser } from "../thunks/userThunks"; // 👈 Import du thunk d'inscription

// État initial pour l'inscription utilisateur
const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Réinitialiser l'état (utile après l'inscription ou pour effacer les erreurs)
    clearUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 En cours d'inscription
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      // ✅ Inscription réussie
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = true;
      })

      // ❌ Inscription échouée
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
