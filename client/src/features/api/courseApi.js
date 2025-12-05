import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API =
  import.meta.env.MODE === "development"
    ? "/api/v1/course" // local → goes through Vite proxy
    : `${import.meta.env.VITE_BACKEND_URL}/api/v1/course`; // Render backend URL

export const courseApi = createApi({
  reducerPath: "courseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),

  tagTypes: ["Course", "Lecture"],

  endpoints: (builder) => ({
    // ──────────────────────────────────────────────
    // COURSE ENDPOINTS
    // ──────────────────────────────────────────────

    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "/create",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Course"],
    }),

    getAllCreatorCourses: builder.query({
      query: () => `/creator`,
      providesTags: ["Course"],
    }),

    getPublishedCourse: builder.query({
      query: () => `/creator/publish-course`,
      providesTags: ["Course"],
    }),

    getCourseById: builder.query({
      query: (courseId) => `/creator/${courseId}`,
      providesTags: (_, __, courseId) => [{ type: "Course", id: courseId }],
    }),

    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/creator/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],
    }),

    publishCourse: builder.mutation({
      query: ({ courseId }) => ({
        url: `/creator/${courseId}/publish`,
        method: "PATCH",
      }),
      invalidatesTags: ["Course"],
    }),

    getSearchCourse: builder.query({
      query: ({ searchQuery = "", categories = [], sortByPrice = "" }) => {
        const params = new URLSearchParams();

        if (searchQuery) params.append("query", searchQuery);
        if (categories.length) params.append("categories", categories.join(","));
        if (sortByPrice) params.append("sortByPrice", sortByPrice);

        return {
          url: `/search?${params.toString()}`,
          method: "GET",
        };
      },
    }),


  // ──────────────────────────────────────────────
// DELETE COURSE
// ──────────────────────────────────────────────
    deleteCourse: builder.mutation({
      query: ({ courseId }) => ({
        url: `/creator/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course", "Lecture"],
    }),


    // ──────────────────────────────────────────────
    // LECTURE ENDPOINTS
    // ──────────────────────────────────────────────

    createLecture: builder.mutation({
      query: ({ courseId, lectureTitle }) => ({
        url: `/creator/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: ["Lecture"],
    }),

    getCourseLecture: builder.query({
      query: (courseId) => `/creator/${courseId}/lecture`,
      providesTags: ["Lecture"],
    }),

    // ✔ Correct endpoint: GET /creator/lecture/:lectureId
    getLectureById: builder.query({
      query: (lectureId) => `/creator/lecture/${lectureId}`,
      providesTags: ["Lecture"],
    }),

    // ✔ Correct body structure
    editLecture: builder.mutation({
      query: ({ courseId, lectureId, lectureTitle, videoUrl, publicId, isPreviewFree }) => ({
        url: `/creator/${courseId}/lecture/${lectureId}`,
        method: "PUT",
        body: { lectureTitle, videoUrl, publicId, isPreviewFree },
      }),
      invalidatesTags: ["Lecture"],
    }),

    // ✔ Correct backend route
    removeLecture: builder.mutation({
      query: ({ lectureId }) => ({
        url: `/creator/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lecture"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCreatorCoursesQuery,
  useGetPublishedCourseQuery,
  useGetCourseByIdQuery,
  useEditCourseMutation,
  usePublishCourseMutation,
  useGetSearchCourseQuery,
  useDeleteCourseMutation,

  // Lectures
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useGetLectureByIdQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
} = courseApi;
