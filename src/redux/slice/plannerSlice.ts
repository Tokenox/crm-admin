import { createSlice } from '@reduxjs/toolkit';
import { PlannerResponseTypes } from '../../types';
import { createPlanner, getPlanners } from '../middleware/planner';

const initialState: { data: PlannerResponseTypes[]; events: { title: string; start: Date; end: Date }[]; loading: boolean; error: any } = {
  loading: false,
  data: [],
  events: [],
  error: null
};

const plannerSlice = createSlice({
  name: 'plannerSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Planners
    builder.addCase(getPlanners.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPlanners.fulfilled, (state, action) => {
      state.data = action.payload;
      state.events = action.payload.items.map((planner) => {
        return {
          title: planner.title,
          start: new Date(planner.startDate),
          end: new Date(Number(planner.timeOfExecution))
        };
      });
    });
    builder.addCase(getPlanners.rejected, (state, action) => {
      state.error = action.error;
    });

    // Create Planner
    builder.addCase(createPlanner.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPlanner.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(createPlanner.rejected, (state, action) => {
      state.error = action.error;
    });
  }
});

export default plannerSlice.reducer;
export const plannerSelector = (state) => state.planner;
export const plannerLoading = (state) => state.planner.loading;
