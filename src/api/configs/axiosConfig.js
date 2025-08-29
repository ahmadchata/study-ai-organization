import axios from "axios";

const BASEURL = "https://api.study-ai.org/api";

export const api = axios.create({
  timeout: 60000,
  baseURL: BASEURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

const errorHandler = (error) => {
  const statusCode = error.response?.status;

  if (statusCode && statusCode !== 401) {
    console.error(error);
  }

  return Promise.reject(error);
};

api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});
