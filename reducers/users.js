import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice Redux pour la gestion de l'utilisateur connecté.
 *
 * État :
 * - token : token de session (Bearer), persisté dans localStorage
 * - role  : "admin" | "user", détermine les droits d'accès dans l'UI
 *
 * Persistance : le token et le rôle sont sauvegardés dans localStorage
 * au login (Home.jsx) et rechargés dans Redux au démarrage (ClientLayout.jsx).
 */
const usersSlice = createSlice({
  name: "users",
  initialState: {
    token: "",
    role: "",
  },
  reducers: {
    /** Appelé après un login réussi — stocke token et rôle */
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    /** Appelé à la déconnexion — vide le store et localStorage */
    logout: (state) => {
      state.token = "";
      state.role = "";
    },
  },
});

export const { setUser, logout } = usersSlice.actions;
export default usersSlice.reducer;
