import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // ⬅ Important for Protected Routes
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      const user = action.payload;

      if (!user) {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;  // ⬅ Prevent infinite loading
        return;
      }

      state.user = user;
      state.isAuthenticated = true;
      state.loading = false; // ⬅ Ready
    },

    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false; // ⬅ No longer loading
    },

    finishLoading: (state) => {
      state.loading = false; // ⬅ Use when loadUser fails
    },
  },
});

export const { userLoggedIn, userLoggedOut, finishLoading } = authSlice.actions;
export default authSlice.reducer;
