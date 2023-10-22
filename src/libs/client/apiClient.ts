import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/rest',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const { get, post, put, delete: destroy } = apiClient;
export default apiClient;

// how to use it

// const getLeads = async () => {
//   const { data } = await get('/lead');
//   return data;
// };

// const createLead = async (lead) => {
//   const { data } = await post('/lead', lead);
//   return data;
// };

// const updateLead = async (lead) => {
//   const { data } = await put('/lead', lead);
//   return data;
// };

// const deleteLead = async (lead) => {
//   const { data } = await destroy('/lead', lead);
//   return data;
// };

// export { getLeads, createLead, updateLead, deleteLead };
