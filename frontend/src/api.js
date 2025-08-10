import axios from 'axios';

// const API_BASE_URL = "https://formbuilder-1-domz.onrender.com/api";
// In your API client file (api.js), modify the base URL:
const API_BASE_URL = "https://formbuilder-2-6e62.onrender.com/api";
  


export const createForm = (form) =>{ 
    console.log("API Base URL:", API_BASE_URL);
    return axios.post(`${API_BASE_URL}/forms`, form)};
export const getForms = () => axios.get(`${API_BASE_URL}/forms`);
export const getFormById = (id) => axios.get(`${API_BASE_URL}/forms/${id}`);
export const submitResponse = (data) => axios.post(`${API_BASE_URL}/responses`, data);
export const getResponses = (formId) => axios.get(`${API_BASE_URL}/responses/${formId}`);