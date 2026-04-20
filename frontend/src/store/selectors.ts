import { RootState } from './index';

// Auth selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Jobs selectors
export const selectAllJobs = (state: RootState) => state.jobs.items;
export const selectJobsLoading = (state: RootState) => state.jobs.loading;
export const selectJobsError = (state: RootState) => state.jobs.error;
export const selectActiveJobs = (state: RootState) =>
  state.jobs.items.filter((j) => j.status === 'Active');

// Matches selectors
export const selectMatches = (state: RootState) => state.matches.results;
export const selectMatchesLoading = (state: RootState) => state.matches.loading;
export const selectSkillGaps = (state: RootState) => state.matches.skillGaps;
export const selectGapsLoading = (state: RootState) => state.matches.gapsLoading;
export const selectTopMatches = (state: RootState) =>
  state.matches.results.slice(0, 4);
export const selectHighMatches = (state: RootState) =>
  state.matches.results.filter((m) => m.score >= 80);
export const selectAvgScore = (state: RootState) => {
  const r = state.matches.results;
  return r.length ? Math.round(r.reduce((a, m) => a + m.score, 0) / r.length) : 0;
};

// Users selectors
export const selectAllUsers = (state: RootState) => state.users.items;
export const selectUsersLoading = (state: RootState) => state.users.loading;

// UI selectors
export const selectToast = (state: RootState) => state.ui.toast;