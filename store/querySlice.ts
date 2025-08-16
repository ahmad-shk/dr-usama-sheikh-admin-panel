import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { type Query, fetchQueries, updateQueryStatus, deleteQuery } from "@/lib/api"

interface QueryState {
  queries: Query[]
  loading: boolean
  error: string | null
  lastFetch: number | null
}

const initialState: QueryState = {
  queries: [],
  loading: false,
  error: null,
  lastFetch: null,
}

export const fetchQueriesAction = createAsyncThunk("queries/fetchQueries", async () => {
  const queries = await fetchQueries()
  return queries
})

export const updateQueryStatusAction = createAsyncThunk(
  "queries/updateQueryStatus",
  async ({ id, status }: { id: string; status: "pending" | "answered" | "closed" }) => {
    const updatedQuery = await updateQueryStatus(id, status)
    return updatedQuery
  },
)

export const deleteQueryAction = createAsyncThunk("queries/deleteQuery", async (id: string) => {
  await deleteQuery(id)
  return id
})

const querySlice = createSlice({
  name: "queries",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setLastFetch: (state, action) => {
      state.lastFetch = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch queries
      .addCase(fetchQueriesAction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQueriesAction.fulfilled, (state, action) => {
        state.loading = false
        state.queries = action.payload
        state.lastFetch = Date.now()
      })
      .addCase(fetchQueriesAction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch queries"
      })
      // Update query status
      .addCase(updateQueryStatusAction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateQueryStatusAction.fulfilled, (state, action) => {
        state.loading = false
        const index = state.queries.findIndex((query) => query._id === action.payload._id)
        if (index !== -1) {
          state.queries[index] = action.payload
        }
      })
      .addCase(updateQueryStatusAction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update query status"
      })
      // Delete query
      .addCase(deleteQueryAction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteQueryAction.fulfilled, (state, action) => {
        state.loading = false
        state.queries = state.queries.filter((query) => query._id !== action.payload)
      })
      .addCase(deleteQueryAction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to delete query"
      })
  },
})

export const { clearError, setLastFetch } = querySlice.actions
export default querySlice.reducer
