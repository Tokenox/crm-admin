import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, post, put, destroy } from '../../libs/client/apiClient';
import { LeadsTypes } from '../../types';

export const getLeads = createAsyncThunk('lead/get', async ({ signal }: { signal: AbortSignal }) => {
  try {
    const { data } = await get('/lead', { signal });
    return data.data;
  } catch (error) {
    throw error;
  }
});

export const createLead = createAsyncThunk('lead/create', async ({ lead, signal }: { lead: LeadsTypes; signal: AbortSignal }) => {
  try {
    const { data } = await post('/lead', lead, { signal });
    return data.data;
  } catch (error) {
    throw error;
  }
});

export const createBulkLead = createAsyncThunk(
  'lead/createBulk',
  async ({ leads, signal }: { leads: LeadsTypes[]; signal: AbortSignal }) => {
    try {
      const { data } = await post('/lead/bulk', leads, { signal });
      return data.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateLead = createAsyncThunk('lead/update', async ({ lead, signal }: { lead: LeadsTypes; signal: AbortSignal }) => {
  try {
    const { data } = await put('/lead', lead, { signal });
    return data.data;
  } catch (error) {
    throw error;
  }
});

export const deleteLead = createAsyncThunk('lead/delete', async ({ id }: { id: string }) => {
  try {
    const { data } = await destroy(`/lead/${id}`);
    return data.data;
  } catch (error) {
    throw error;
  }
});
