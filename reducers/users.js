import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
};

export const usersSlice = createSlice({
  name: "users",

  initialState,
  reducers: {
    addTokenStore: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addTokenStore } = usersSlice.actions;
export default usersSlice.reducer;
