import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn, userLoggedOut, finishLoading } from '../authSlice';

const USER_API =  import.meta.env.MODE === "development"
    ? "/api/v1/user" // proxy only works in dev
    : `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`;

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include", // ⬅ required for JWT cookies
  }),

  tagTypes: ["User"],

  endpoints: (builder) => ({

    // ---------------------
    // REGISTER USER
    // ---------------------
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "/register",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["User"],
    }),

    // ---------------------
    // LOGIN USER
    // ---------------------
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "/login",
        method: "POST",
        body: inputData,
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn(data.user));
        } catch (error) {
          console.error("Login Error:", error);
          dispatch(finishLoading());
        }
      },

      invalidatesTags: ["User"],
    }),

    // ---------------------
    // LOGOUT USER
    // ---------------------
      logoutUser: builder.mutation({
        query: () => ({
          url: "/logout",
          method: "POST",
          credentials: "include",
        }),
        async onQueryStarted(_, { queryFulfilled, dispatch }) {
          try {
            await queryFulfilled;
            dispatch(userLoggedOut());
          } catch (err) {
            console.error("Logout Error:", err);
          }
        },
        invalidatesTags: ["User"],
      }),


    // ---------------------
    // LOAD USER (Auto login on refresh)
    // ---------------------
    loadUser: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          // If user exists → Login
          dispatch(userLoggedIn(data.user));
        } catch (error) {
          // Token expired / invalid cookie → logout
          dispatch(userLoggedOut());
          console.error("Load User Error:", error);
        } finally {
          dispatch(finishLoading()); // ⬅ IMPORTANT
        }
      },

      providesTags: ["User"],
    }),

    // ---------------------
    // UPDATE USER PROFILE
    // ---------------------
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "/profile/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
} = authApi;
