import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { User } from '@/types';
import { updateUserInStore } from '../slices/authSlice';

export const addSkill = createAsyncThunk(
  'skills/add',
  async (skill: string, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/users/skills', { skills: [skill] });
      dispatch(updateUserInStore(data.data as User));
      return data.data as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add skill');
    }
  }
);

export const removeSkill = createAsyncThunk(
  'skills/remove',
  async (skill: string, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/users/skills/${encodeURIComponent(skill)}`);
      dispatch(updateUserInStore(data.data as User));
      return data.data as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove skill');
    }
  }
);

export const uploadResume = createAsyncThunk(
  'skills/uploadResume',
  async (
    { file, onProgress }: { file: File; onProgress?: (pct: number) => void },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await api.post('/users/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      dispatch(updateUserInStore(data.data.user as User));
      return data.data.extractedSkills as string[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Upload failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (name: string, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.put('/users/profile', { name });
      dispatch(updateUserInStore(data.data as User));
      return data.data as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  }
);