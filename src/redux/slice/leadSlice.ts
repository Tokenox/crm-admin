import { createSlice } from '@reduxjs/toolkit';
import { LeadsTypes } from '../../types';
import { getLeads } from '../middleware/lead';

const initialState: { data: LeadsTypes[] } = {
  data: []
};

const leadSlice = createSlice({
  name: 'leadSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLeads.pending, (state, action) => {
      state.data = [];
    });
    builder.addCase(getLeads.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(getLeads.rejected, (state, action) => {
      state.data = [];
    });
  }
});

export default leadSlice.reducer;
export const leadsList = (state) => state.lead.data;
