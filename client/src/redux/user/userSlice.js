import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  otpgen: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signupStart: (state) => {
      state.loading = true;
    },
    signupSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    signupFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updatePassStart: (state) => {
      state.loading = true;
    },
    updatePassSuccess: (state) => {
      state.loading = false;
    },
    updatePassFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logOutStart: (state) => {
      state.loading = true;
    },
    logOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    logOutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserAccountStart: (state) => {
      state.loading = true;
    },
    deleteUserAccountSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserAccountFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setGENOTP: (state, action) => { 
      state.otpgen = action.payload;
    },
    clearOTP: (state) => {
      state.otpgen = null;
    }
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
  setGENOTP,
  clearOTP
} = userSlice.actions;

export default userSlice.reducer;
