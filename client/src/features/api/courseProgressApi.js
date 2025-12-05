import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API =
  import.meta.env.MODE === "development"
    ? "/api/v1/progress" // Local dev → handled by Vite proxy
    : `${import.meta.env.VITE_BACKEND_URL}/api/v1/progress`; // Render production URL

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),
  tagTypes: ["CourseProgress"], // declare tag type
  endpoints: (builder) => ({
    // Get overall course progress
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [
        { type: "CourseProgress", id: courseId },
      ],
    }),

    // Mark individual lecture as viewed
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/view`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "CourseProgress", id: courseId },
      ],
    }),

    // Mark entire course as completed
    completeCourse: builder.mutation({
      query: ({ courseId }) => ({
        url: `/${courseId}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "CourseProgress", id: courseId },
      ],
    }),

    // Mark entire course as incomplete
    incompleteCourse: builder.mutation({
      query: ({ courseId }) => ({
        url: `/${courseId}/incomplete`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "CourseProgress", id: courseId },
      ],
    }),

    // Reset course progress
    resetCourse: builder.mutation({
      query: ({ courseId }) => ({
        url: `/${courseId}/reset`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "CourseProgress", id: courseId },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useIncompleteCourseMutation,
  useResetCourseMutation,
} = courseProgressApi;
