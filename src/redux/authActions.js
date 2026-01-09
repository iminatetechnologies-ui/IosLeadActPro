import { login } from "./../api/authApi";
import { loginStart, loginSuccess, loginFailure, logout } from "./authSlice";
import { saveToken, clearToken } from "./../utils/storage";

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const data = await login(credentials);
    await saveToken(data.token); // Save token in AsyncStorage
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logoutUser = () => async (dispatch) => {
  await clearToken(); // Clear token from AsyncStorage
  dispatch(logout());
};
