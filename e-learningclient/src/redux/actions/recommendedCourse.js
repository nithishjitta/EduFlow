import { server } from '../store';
import axios from 'axios';

export const createRecommendationCourses = () => async dispatch => {
  try {
    dispatch({ type: 'RecommendedCoursesRequest' });
    const { data } = await axios.post(
      `${server}/recommend`,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    dispatch({ type: 'RecommendedCoursesSuccess', payload: data.courses });
  } catch (error) {
    // If not logged in or error, just show empty — don't crash
    dispatch({
      type: 'RecommendedCoursesFail',
      payload: error.response?.data?.message || 'Failed to load recommendations',
    });
  }
};
