import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  isAuthenticated: false,
  role: '',
  userId: null,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = '';
      state.role = '';
      state.userId = null;
    },
    setAuthError(state, action) {
      state.error = action.payload;
    }
  }
});

export const { loginSuccess, logout, setAuthError } = authSlice.actions;
export default authSlice.reducer;
