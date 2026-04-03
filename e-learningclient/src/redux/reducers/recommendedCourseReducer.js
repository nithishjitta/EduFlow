import { createReducer } from '@reduxjs/toolkit';
export const recommendedCourseReducer = createReducer(
  { courses: [], lectures: [] },
  (builder) => {
    builder
      .addCase('RecommendedCoursesRequest', (state) => {
        state.loading = true;
      })
      .addCase('RecommendedCoursesSuccess', (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase('RecommendedCoursesFail', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase('clearError', (state) => {
        state.error = null;
      })
      .addCase('clearMessage', (state) => {
        state.message = null;
      });
  }
);
