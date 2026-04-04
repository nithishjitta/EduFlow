import { server } from '../store';
import axios from 'axios';

export const login = (email, password) => async dispatch => {
  try {
    dispatch({ type: 'loginRequest' });

    const { data } = await axios.post(`${server}/login`, 
      { email, password },  // ✅ send as JSON
      {
        headers: { 'Content-Type': 'application/json' }, // ✅ JSON header
        withCredentials: true,
      }
    );

    dispatch({ type: 'loginSuccess', payload: data });
  } catch (error) {
    dispatch({ type: 'loginFail', payload: error.response?.data?.message || 'Login failed' });
  }
};

export const register = formdata => async dispatch => {
  try {
    dispatch({ type: 'registerRequest' });
    // formdata is already FormData with file — Spring Boot accepts multipart
    const { data } = await axios.post(`${server}/register`, formdata, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });

    dispatch({ type: 'registerSuccess', payload: data });
  } catch (error) {
    dispatch({ type: 'registerFail', payload: error.response?.data?.message || 'Registration failed' });
  }
};

export const loadUser = () => async dispatch => {
  try {
    dispatch({ type: 'loadUserRequest' });
    const { data } = await axios.get(`${server}/me`, { withCredentials: true });
    dispatch({ type: 'loadUserSuccess', payload: data.user });
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      dispatch({ type: 'loadUserFail', payload: null });
    } else {
      dispatch({ type: 'loadUserFail', payload: error.response?.data?.message || 'Network error' });
    }
  }
};

export const logout = () => async dispatch => {
  try {
    dispatch({ type: 'logoutRequest' });
    const { data } = await axios.get(`${server}/logout`, { withCredentials: true });
    dispatch({ type: 'logoutSuccess', payload: data.message });
  } catch (error) {
    dispatch({ type: 'logoutFail', payload: error.response?.data?.message || 'Logout failed' });
  }
};

export const buySubscription = () => async dispatch => {
  try {
    dispatch({ type: 'buySubscriptionRequest' });
    const { data } = await axios.get(`${server}/subscribe`, { withCredentials: true });
    dispatch({ type: 'buySubscriptionSuccess', payload: data.sessionId });
    // Return the full data so Subscribe.jsx can get data.url
    return data;
  } catch (error) {
    dispatch({
      type: 'buySubscriptionFail',
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const cancelSubscription = () => async dispatch => {
  try {
    dispatch({ type: 'cancelSubscriptionRequest' });
    const { data } = await axios.delete(`${server}/subscribe/cancel`, { withCredentials: true });
    dispatch({ type: 'cancelSubscriptionSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'cancelSubscriptionFail',
      payload: error.response?.data?.message || 'Cancel subscription failed',
    });
  }
};
