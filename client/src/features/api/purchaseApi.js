import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "/api/v1/purchase"   // Dev → handled by Vite proxy
    : `${import.meta.env.VITE_BACKEND_URL}/api/v1/purchase`;  // Production → Render backend URL

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({

    // 🔹 Create Stripe Checkout Session
    createCheckoutSession: builder.mutation({
      query: ({ courseId }) => ({
        url: "checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
    }),

    // 🔹 Get Course Details with Purchase Status
    getCourseDetailsWithStatus: builder.query({
      query: (courseId) => ({
        url: `course/${courseId}/details-with-status`,
        method: "GET",
      }),
    }),

    // 🔹 Get All Purchased Courses for Current User
      getPurchasedCourses: builder.query({
      query: () => ({
        url: "/", 
        method: "GET",
      }),
    }),

  }),
});

// ✅ Export hooks
export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailsWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = purchaseApi;

