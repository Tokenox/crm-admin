import { createSlice } from '@reduxjs/toolkit';
import { LeadsTypes } from '../../types';
import { getLead, getLeads, createLead, createBulkLead, updateLead, deleteLead } from '../middleware/lead';

const initialState: { data: LeadsTypes[] } = {
  data: []
};

const leadSlice = createSlice({
  name: 'leadSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLeads.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(getLead.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(createLead.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(createBulkLead.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(updateLead.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(deleteLead.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  }
});

export default leadSlice.reducer;
export const leadsList = (state) => state.lead.data;
