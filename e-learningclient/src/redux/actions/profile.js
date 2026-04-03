import { server } from '../store';
import axios from 'axios';

export const updateProfile = (name, email) => async dispatch => {
  try {
    dispatch({ type: 'updateProfileRequest' });
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (email) params.append('email', email);

    const { data } = await axios.put(`${server}/updateprofile`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    });

    dispatch({ type: 'updateProfileSuccess', payload: data.message });
  } catch (error) {
    dispatch({ type: 'updateProfileFail', payload: error.response?.data?.message || 'Update failed' });
  }
};

export const updateProfilePicture = formdata => async dispatch => {
  try {
    dispatch({ type: 'updateProfilePictureRequest' });
    const { data } = await axios.put(`${server}/updateprofilepicture`, formdata, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });

    dispatch({ type: 'updateProfilePictureSuccess', payload: data.message });
  } catch (error) {
    dispatch({ type: 'updateProfilePictureFail', payload: error.response?.data?.message || 'Update failed' });
  }
};

export const changePassword = (oldPassword, newPassword) => async dispatch => {
  try {
    dispatch({ type: 'changePasswordRequest' });
    const params = new URLSearchParams();
    params.append('oldPassword', oldPassword);
    params.append('newPassword', newPassword);

    const { data } = await axios.put(`${server}/changepassword`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    });

    dispatch({ type: 'changePasswordSuccess', payload: data.message });
  } catch (error) {
    dispatch({ type: 'changePasswordFail', payload: error.response?.data?.message || 'Change password failed' });
  }
};

export const forgetPassword = email => async dispatch => {
  try {
    dispatch({ type: 'forgetPasswordRequest' });
    const params = new URLSearchParams();
    params.append('email', email);

    const { data } = await axios.post(`${server}/forgetpassword`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    });

    dispatch({ type: 'forgetPasswordSuccess', payload: data.message });
  } catch (error) {
    dispatch({ type: 'forgetPasswordFail', payload: error.response?.data?.message || 'Failed to send reset email' });
  }
};

export const resetPassword = (token, password) => async dispatch => {
  try {
    dispatch({ type: 'resetPasswordRequest' });
    const params = new URLSearchParams();
    params.append('password', password);

    const { data } = await axios.put(`${server}/resetpassword/${token}`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    });

    dispatch({ type: 'resetPasswordSuccess', payload: data.message });
  } catch (error) {
    dispatch({ type: 'resetPasswordFail', payload: error.response?.data?.message || 'Reset failed' });
  }
};

export const addToPlaylist = id => async dispatch => {
  try {
    dispatch({ type: 'addToPlaylistRequest' });
    const params = new URLSearchParams();
    params.append('id', id);

    const { data } = await axios.post(`${server}/addtoplaylist`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    });

    dispatch({ type: 'addToPlaylistSuccess', payload: data.message });
  } catch (error) {
    dispatch({ type: 'addToPlaylistFail', payload: error.response?.data?.message || 'Failed to add to playlist' });
  }
};

export const removeFromPlaylist = id => async dispatch => {
  try {
    dispatch({ type: 'removeFromPlaylistRequest' });
    const { data } = await axios.delete(`${server}/removefromplaylist?id=${id}`, {
      withCredentials: true,
    });

    dispatch({ type: 'removeFromPlaylistSuccess', payload: data.message });
  } catch (error) {
    dispatch({ type: 'removeFromPlaylistFail', payload: error.response?.data?.message || 'Failed to remove' });
  }
};
