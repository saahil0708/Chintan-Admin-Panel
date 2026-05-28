import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  userData: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  isLoading: false,
  isInitializing: true,
  error: null,
};

// Async Thunks
export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/auth/is-authenticated');
      if (data && data.authenticated === true && data.user && data.user._id) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
        return data.user;
      } else {
        throw new Error("Invalid auth response");
      }
    } catch (error) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/users/profile');
      if (data && data._id) {
        localStorage.setItem("user", JSON.stringify(data));
        return data;
      }
      return null;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user data");
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/api/auth/logout', {});
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      toast.success("Logout Successful");
      return null;
    } catch (error) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ email, otp }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/verify-account', { email, otp });
      if (data.message?.toLowerCase().includes("success")) {
        toast.success(data.message);
        await dispatch(fetchUserProfile());
        return true;
      } else {
        toast.error(data.message || "Verification failed");
        return rejectWithValue(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
      return rejectWithValue(error.response?.data?.message || "Verification failed");
    }
  }
);

export const sendVerificationOTP = createAsyncThunk(
  'auth/sendVerificationOTP',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/send-otp', { email });
      toast.success(data.message || "OTP sent to your email.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
  }
);

export const sendResetOTP = createAsyncThunk(
  'auth/sendResetOTP',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/send-reset-otp', { email });
      toast.success(data.message || "Reset OTP sent to your email.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset OTP");
      return rejectWithValue(error.response?.data?.message || "Failed to send reset OTP");
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/reset-password', { email, otp, newPassword });
      toast.success(data.message || "Password reset successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      return rejectWithValue(error.response?.data?.message || "Failed to reset password");
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload;
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setInitializing: (state, action) => {
      state.isInitializing = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // checkAuthState
      .addCase(checkAuthState.pending, (state) => {
        // We don't set loading here to prevent whole screen flashes if we do background checks
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.userData = action.payload;
        state.isInitializing = false;
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.userData = null;
        state.isInitializing = false;
      })
      // fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.userData = action.payload;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload === "Unauthorized" || !state.userData) {
           state.isLoggedIn = false;
        }
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userData = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoggedIn = false;
        state.userData = null;
      })
      // verifyEmail
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyEmail.rejected, (state) => {
        state.isLoading = false;
      })
      // sendVerificationOTP
      .addCase(sendVerificationOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendVerificationOTP.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendVerificationOTP.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { loginSuccess, setInitializing, setLoading } = authSlice.actions;
export default authSlice.reducer;
