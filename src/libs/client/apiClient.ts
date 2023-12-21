import axios from 'axios';
import { urls } from '../../apiConfig';

const env = process.env.REACT_APP_STAGE || 'local';
export const baseURL = urls[env] || 'https://recrm-dd33eadabf10.herokuapp.com/rest';

// read token from localStorage
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGE2NmE1N2I0NDdiYTI0YWZlNTViYyIsImVtYWlsIjoiYmFrYXIuZGV2c0BnbWFpbC5jb20iLCJyb2xlIjoiQ1JNIFN5c3RlbSBBZG1pbmlzdHJhdG9yIiwiaWF0IjoxNzAyOTY3ODgxLCJleHAiOjE3MDM1NzI2ODEsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMCJ9.h_SdYiR4tssiY2-FimZTcMpGZClcsG-DV29A9QurkSc';

const apiClient = axios.create({
  baseURL: baseURL || 'https://recrm-dd33eadabf10.herokuapp.com/rest',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: token
  }
});

export const { get, post, put, delete: destroy } = apiClient;
export default apiClient;
