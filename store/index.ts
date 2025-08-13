import { configureStore } from "@reduxjs/toolkit"
import appointmentReducer from "./appointmentSlice"

export const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
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
