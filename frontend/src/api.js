import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createForm = (form) => axios.post(`${API_BASE_URL}/forms`, form);
export const getForms = () => axios.get(`${API_BASE_URL}/forms`);
export const getFormById = (id) => axios.get(`${API_BASE_URL}/forms/${id}`);
export const submitResponse = (data) => axios.post(`${API_BASE_URL}/responses`, data);
export const getResponses = (formId) => axios.get(`${API_BASE_URL}/responses/${formId}`);