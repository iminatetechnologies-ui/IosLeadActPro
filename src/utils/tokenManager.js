// utils/tokenManager.js
let authToken = null;

export const setToken = (token) => {
  authToken = token;
};

export const getToken = () => authToken;
