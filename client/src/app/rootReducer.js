import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/features/authSlice";

import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";

// Combine ALL reducers (Slices + RTK Query APIs)
const rootReducer = combineReducers({
  auth: authReducer,

  // RTK Query reducers (always include reducerPath)
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [courseProgressApi.reducerPath]: courseProgressApi.reducer,
});

export default rootReducer;


