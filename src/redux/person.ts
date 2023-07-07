import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tmdbClient } from "../api/axiosClients";

const initialState = {
  getCreditsLoading: false,
  getCreditsResult: [],
  getCreditsError: false,
};

export const getCredits = createAsyncThunk("getCredits", async (id: string) => {
  const [tvCredits, movieCredits] = await Promise.all([
    tmdbClient.get(`/person/${id}/tv_credits`),
    tmdbClient.get(`/person/${id}/movie_credits`),
  ]);
  const tvCreditsArray = [...tvCredits.data?.cast, ...tvCredits.data?.crew];
  const movieCreditsArray = [
    ...movieCredits.data?.cast,
    ...movieCredits.data?.crew,
  ];
  return [...tvCreditsArray, ...movieCreditsArray];
});

export const person = createSlice({
  name: "person",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCredits.pending, (state, action) => {
      state.getCreditsLoading = true;
    });
    builder.addCase(getCredits.fulfilled, (state, action) => {
      state.getCreditsLoading = false;
      state.getCreditsResult = action.payload;
    });
    builder.addCase(getCredits.rejected, (state, action) => {
      state.getCreditsLoading = false;
      state.getCreditsError = true;
    });
  },
});

export default person.reducer;
