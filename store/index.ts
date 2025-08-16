import { configureStore } from "@reduxjs/toolkit"
import appointmentReducer from "./appointmentSlice"
import queryReducer from "./querySlice"

export const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    queries: queryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
