import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "../../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// const initialState = {
//     user: {
//       email: '',
//     },
//     isLoading: false,
//     isError: false,
//     error: null,
//   };
//   export const createUser = createAsyncThunk(
//     'user/createUser',
//     async ({ email, password }) => {
//         try{
//             const data = await createUserWithEmailAndPassword(auth, email, password);
//             return data.user.email;
//         }
//         catch(error){
//             console.error('Error creating user:', error.message);
//             throw error;
//         }
//     }
//   );
//   export const loginUser = createAsyncThunk(
//     'user/loginUser',
//     async ({ email, password }) => {
//         try{
//
//             const data = await signInWithEmailAndPassword(auth, email, password);
//
//             return data.user.email;
//         }
//         catch(error){
//           const errorCode = error.code;
//             console.error('Error creating user:', error.message,errorCode);
//             throw error;
//         }
//     }
//   );
//   const userSlice = createSlice({
//     name:'uer',
//     initialState,
//     reducers:{
//       setUser:(state,action)=>{

//         state.user.email=action.payload
//       },
//       setLoading: (state, action) => {
//         state.isLoading = action.payload;
//       },
//     },
//     extraReducers:(builder)=>{
//         builder
//          .addCase(createUser.pending, (state) => {
//             state.isLoading = true;
//             state.isError = false;
//             state.error = null;
//           })
//           .addCase(createUser.fulfilled, (state, action) => {
//             state.user.email = action.payload;
//             console.log(action.payload)
//             state.isLoading = false;
//           })
//           .addCase(createUser.rejected, (state, action) => {
//             state.user.email = null;
//             state.isLoading = false;
//             state.isError = true;
//             state.error = action.error.message;
//           })
//           .addCase(loginUser.pending, (state) => {
//             state.isLoading = true;
//             state.isError = false;
//             state.error = null;
//           })
//           .addCase(loginUser.fulfilled, (state, action) => {
//             state.user.email = action.payload;
//             state.isLoading = false;
//             state.isError = false;
//           })
//           .addCase(loginUser.rejected, (state, action) => {
//             state.user.email = null;
//             state.isLoading = false;
//             state.isError = true;
//             state.error = action.error.message;
//           });
//     }
//   })
//   export const {setUser,setLoading}=userSlice.actions
//   export default userSlice.reducer;
const initialState = {
  token: null,
  status: "idle",
  error: null,
  isError: false,
  isLoggedIn: false, // Add new state variable
  isRegistered: false,
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload;
        state.isRegistered = true; // Set isRegistered to true upon successful registration
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload;
        state.isLoggedIn = true; // Set isLoggedIn to true upon successful login
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// export const {setUser,setLoading}=userSlice.actions
export default userSlice.reducer;
