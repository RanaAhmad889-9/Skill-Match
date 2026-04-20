import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { Job } from '@/types';

interface JobsState {
  items: Job[];
  loading: boolean;
  error: string | null;
  selectedJob: Job | null;
}

const initialState: JobsState = {
  items: [],
  loading: false,
  error: null,
  selectedJob: null,
};

export const fetchAllJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (filters: { status?: string; type?: string; search?: string } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.type) params.set('type', filters.type);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/jobs?${params.toString()}`);
      return data.data as Job[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData: Partial<Job>, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/jobs', jobData);
      return data.data as Job;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ id, jobData }: { id: string; jobData: Partial<Job> }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/jobs/${id}`, jobData);
      return data.data as Job;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/jobs/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete job');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSelectedJob(state, action) {
      state.selectedJob = action.payload;
    },
    clearJobsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllJobs.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchAllJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

    builder
      .addCase(createJob.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(createJob.rejected, (state, action) => { state.error = action.payload as string; });

    builder
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.items.findIndex((j) => j._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateJob.rejected, (state, action) => { state.error = action.payload as string; });

    builder
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.items = state.items.filter((j) => j._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => { state.error = action.payload as string; });
  },
});

export const { setSelectedJob, clearJobsError } = jobsSlice.actions;
export default jobsSlice.reducer;