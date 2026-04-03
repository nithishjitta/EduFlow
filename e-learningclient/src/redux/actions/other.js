import { server } from '../store';
import axios from 'axios';

export const contactUs = (name, email, message) => async dispatch => {
  try {
    dispatch({ type: 'contactRequest' });
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('message', message);

    const { data } = await axios.post(`${server}/contact`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    });

    dispatch({ type: 'contactSuccess', payload: data.message });
  } catch (error) {
    dispatch({ type: 'contactFail', payload: error.response?.data?.message || 'Failed to send message' });
  }
};

export const courseRequest = (name, email, course) => async dispatch => {
  try {
    dispatch({ type: 'courseRequestRequest' });
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('course', course);

    const { data } = await axios.post(`${server}/courserequest`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    });

    dispatch({ type: 'courseRequestSuccess', payload: data.message });
  } catch (error) {
    dispatch({ type: 'courseRequestFail', payload: error.response?.data?.message || 'Failed to send request' });
  }
};
