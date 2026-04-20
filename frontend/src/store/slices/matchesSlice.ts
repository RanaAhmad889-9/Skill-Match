import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { MatchResult, SkillGap } from '@/types';

interface MatchesState {
  results: MatchResult[];
  skillGaps: SkillGap[];
  loading: boolean;
  gapsLoading: boolean;
  error: string | null;
}

const initialState: MatchesState = {
  results: [],
  skillGaps: [],
  loading: false,
  gapsLoading: false,
  error: null,
};

export const fetchMatches = createAsyncThunk(
  'matches/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/matches');
      return data.data as MatchResult[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch matches');
    }
  }
);

export const fetchSkillGaps = createAsyncThunk(
  'matches/fetchGaps',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/skill-gap');
      return data.data as SkillGap[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch skill gaps');
    }
  }
);

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    clearMatchesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMatches.fulfilled, (state, action) => { state.loading = false; state.results = action.payload; })
      .addCase(fetchMatches.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

    builder
      .addCase(fetchSkillGaps.pending, (state) => { state.gapsLoading = true; })
      .addCase(fetchSkillGaps.fulfilled, (state, action) => { state.gapsLoading = false; state.skillGaps = action.payload; })
      .addCase(fetchSkillGaps.rejected, (state) => { state.gapsLoading = false; });
  },
});

export const { clearMatchesError } = matchesSlice.actions;
export default matchesSlice.reducer;