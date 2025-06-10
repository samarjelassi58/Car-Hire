import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser, loadUserFromToken } from "../thunks/authThunks"; // 👈 importer les thunks ici

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Permet de réinitialiser les erreurs
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔐 Lorsqu'on lance la connexion
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ✅ Connexion réussie
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      // ❌ Connexion échouée
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🚪 Déconnexion réussie
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
      })

      // ❌ Échec déconnexion
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = localStorage.getItem("token");
      })

      .addCase(loadUserFromToken.rejected, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
