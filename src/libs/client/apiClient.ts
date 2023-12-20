import axios from 'axios';
import { urls } from '../../apiConfig';

const env = process.env.REACT_APP_STAGE || 'development';
export const baseURL = 'https://recrm-dd33eadabf10.herokuapp.com/rest';

const apiClient = axios.create({
  baseURL: 'https://recrm-dd33eadabf10.herokuapp.com/rest',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const { get, post, put, delete: destroy } = apiClient;
export default apiClient;
