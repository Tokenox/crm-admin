import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import createAbortController from '../../utils/createAbortController';

export const getLeads = createAsyncThunk('mySlice/myAsyncThunk', async ({ signal }: { signal: AbortSignal }) => {
  const { abort } = createAbortController();

  const config = {
    signal
    // Other Axios configurations
  };

  try {
    const { data } = await axios.get('http://localhost:4000/rest/lead', config);
    // store the abort function in the state so we can cancel the request if needed

    return data.data;
  } catch (error) {
    if (error.name === 'AbortError') {
      // Handle cancellation
      abort();
    } else {
      // Handle other errors
      throw error;
    }
  }
});
