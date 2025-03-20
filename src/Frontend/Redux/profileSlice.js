import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    state: '',
    maritalStatus: '',
    religion: '',
    caste: '',
    height: '',
    weight: '',
    profilePicture: '',
    interests: [],
    aboutMe: '',
    password: ''
  },
  isEditingProfilePic: false,
  phoneError: '',
  emailError: '',
  passwordError: ''
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData(state, action) {
      state.profile = action.payload;
    },
    setEditingProfilePic(state, action) {
      state.isEditingProfilePic = action.payload;
    },
    setPhoneError(state, action) {
      state.phoneError = action.payload;
    },
    setEmailError(state, action) {
      state.emailError = action.payload;
    },
    setPasswordError(state, action) {
      state.passwordError = action.payload;
    }
  }
});

export const { setProfileData, setEditingProfilePic, setPhoneError, setEmailError, setPasswordError } = profileSlice.actions;
export default profileSlice.reducer;
