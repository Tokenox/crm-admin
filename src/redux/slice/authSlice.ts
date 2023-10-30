import { createSlice } from '@reduxjs/toolkit';
import { login } from '../middleware/authentication';

const initialState = {
  loading: false,
  data: [],
  error: null
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    login: (state, action) => {
      state.loading = true;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      document.cookie = `session=${action.payload.token}`;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export default authSlice.reducer;
export const authSelector = (state) => state.auth.data;
export const authLoadingSelector = (state) => state.auth.loading;
