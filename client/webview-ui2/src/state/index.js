import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  apiUrl: "",
  posts: [],
  exams: [],
  selectedExam: "",
  currentLanguage: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setApiUrl: (state, action) => {
      state.apiUrl = action.payload.apiUrl;
    },
    setSelectedExam: (state, action) => {
      state.selectedExam = action.payload.selectedExam;
    },
    setCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload.currentLanguage;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setExams: (state, action) => {
      state.exams = action.payload.exams;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) {
          return action.payload.post;
        }
        return post;
      });
      state.posts = updatedPosts;
    },
    setExam: (state, action) => {
      const updatedExams = state.exams.map((exam) => {
        if (exam._id === action.payload.exam._id) {
          return action.payload.exam;
        }
        return exam;
      });
      state.exams = updatedExams;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setExams, setPost, setExam, setSelectedExam, setCurrentLanguage, setApiUrl } =
  authSlice.actions;
export default authSlice.reducer;
