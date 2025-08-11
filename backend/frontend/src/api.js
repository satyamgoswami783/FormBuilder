import axios from 'axios';



const API_BASE_URL = "http://localhost:4000/";
  


export const createForm = (form) =>{ 
    console.log("API Base URL:", API_BASE_URL);
    return axios.post(`${API_BASE_URL}/forms`, form)};
export const getForms = () => axios.get(`${API_BASE_URL}/forms`);
export const getFormById = (id) => axios.get(`${API_BASE_URL}/forms/${id}`);
export const submitResponse = (data) => axios.post(`${API_BASE_URL}/responses`, data);
export const getResponses = (formId) => axios.get(`${API_BASE_URL}/responses/${formId}`);