import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tmdbClient } from "../api/axiosClients";

type ContentDetail = {
  id: number;
  name: string;
  title: string;
  backdrop_path: string;
  poster_path: string;
  first_air_date: string;
  release_date: string;
  number_of_seasons: number;
  vote_average: number;
  overview: string;
  genres: [];
};

type ContentVideos = {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
};

type ContentAggregateCreditsCast = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  total_episode_count: number;
  order: number;
};

type ContentAggregateCreditsCrew = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null;
  department: string;
  total_episode_count: number;
};

type ContentAggregateCredits = {
  id: number;
  cast: ContentAggregateCreditsCast[];
  crew: ContentAggregateCreditsCrew[];
};

type InitialState = {
  getContentDetailLoading: boolean;
  getContentDetailResult: ContentDetail;
  getContentDetailError: boolean;

  getContentVideosLoading: boolean;
  getContentVideosResult: ContentVideos[];
  getContentVideosError: boolean;

  getContentImagesLoading: boolean;
  getContentImagesResult: [];
  getContentImagesError: boolean;

  getContentAggregateCreditsLoading: boolean;
  getContentAggregateCreditsResult: ContentAggregateCredits;
  getContentAggregateCreditsError: boolean;

  getContentRecommendationsLoading: boolean;
  getContentRecommendationsResult: ContentDetail[];
  getContentRecommendationsError: boolean;
};

const initialState: InitialState = {
  getContentDetailLoading: false,
  getContentDetailResult: {
    id: 0,
    name: "",
    title: "",
    backdrop_path: "",
    poster_path: "",
    first_air_date: "",
    release_date: "",
    number_of_seasons: 0,
    vote_average: 0,
    overview: "",
    genres: [],
  },
  getContentDetailError: false,

  getContentVideosLoading: false,
  getContentVideosResult: [],
  getContentVideosError: false,

  getContentImagesLoading: false,
  getContentImagesResult: [],
  getContentImagesError: false,

  getContentAggregateCreditsLoading: false,
  getContentAggregateCreditsResult: {
    id: 0,
    cast: [],
    crew: [],
  },
  getContentAggregateCreditsError: false,

  getContentRecommendationsLoading: false,
  getContentRecommendationsResult: [],
  getContentRecommendationsError: false,
};

export const getContentDetail = createAsyncThunk(
  "getContentDetail",
  async (item: { id: number; type: number }) => {
    let response = null;
    item.type == 1
      ? (response = await tmdbClient.get("/movie/" + item.id))
      : (response = await tmdbClient.get("/tv/" + item.id));
    return response.data;
  }
);

export const getContentVideos = createAsyncThunk(
  "getContentVideos",
  async (item: { id: number; type: number }) => {
    let response = null;
    item.type == 1
      ? (response = await tmdbClient.get(`/movie/${item?.id}/videos`))
      : (response = await tmdbClient.get(`/tv/${item?.id}/videos`));
    return response.data;
  }
);

export const getContentImages = createAsyncThunk(
  "getContentImages",
  async (item: { id: number; type: number }) => {
    let response = null;
    item.type == 1
      ? (response = await tmdbClient.get(`/movie/${item?.id}/images`))
      : (response = await tmdbClient.get(`/tv/${item?.id}/images`));
    return response.data;
  }
);

export const getContentAggregateCredits = createAsyncThunk(
  "getContentAggregateCredits",
  async (item: { id: number; type: number }) => {
    let response = null;
    item.type == 1
      ? (response = await tmdbClient.get(`/movie/${item?.id}/credits`))
      : (response = await tmdbClient.get(`/tv/${item?.id}/aggregate_credits`));
    return response.data;
  }
);

export const getContentRecommendations = createAsyncThunk(
  "getContentRecommendations",
  async (item: { id: number; type: number }) => {
    let response = null;
    item.type == 1
      ? (response = await tmdbClient.get(`/movie/${item?.id}/recommendations`))
      : (response = await tmdbClient.get(`/tv/${item?.id}/recommendations`));
    return response.data;
  }
);

export const content = createSlice({
  name: "content",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContentDetail.pending, (state, action) => {
      state.getContentDetailLoading = true;
      state.getContentDetailResult = {
        id: 0,
        name: "",
        title: "",
        backdrop_path: "",
        poster_path: "",
        first_air_date: "",
        release_date: "",
        number_of_seasons: 0,
        vote_average: 0,
        overview: "",
        genres: [],
      };
    });
    builder.addCase(getContentDetail.fulfilled, (state, action) => {
      state.getContentDetailLoading = false;
      state.getContentDetailResult = action.payload;
    });
    builder.addCase(getContentDetail.rejected, (state, action) => {
      state.getContentDetailLoading = false;
      state.getContentDetailError = true;
    });

    builder.addCase(getContentVideos.pending, (state, action) => {
      state.getContentVideosLoading = true;
      state.getContentVideosResult = [];
    });
    builder.addCase(getContentVideos.fulfilled, (state, action) => {
      state.getContentVideosLoading = false;
      state.getContentVideosResult = action.payload.results;
    });
    builder.addCase(getContentVideos.rejected, (state, action) => {
      state.getContentVideosLoading = false;
      state.getContentVideosError = true;
    });

    builder.addCase(getContentImages.pending, (state, action) => {
      state.getContentImagesLoading = true;
      state.getContentImagesResult = [];
    });
    builder.addCase(getContentImages.fulfilled, (state, action) => {
      state.getContentImagesLoading = false;
      state.getContentImagesResult = action.payload;
    });
    builder.addCase(getContentImages.rejected, (state, action) => {
      state.getContentImagesLoading = false;
      state.getContentImagesError = true;
    });

    builder.addCase(getContentAggregateCredits.pending, (state, action) => {
      state.getContentAggregateCreditsLoading = true;
      state.getContentAggregateCreditsResult = {
        id: 0,
        cast: [],
        crew: [],
      };
    });
    builder.addCase(getContentAggregateCredits.fulfilled, (state, action) => {
      state.getContentAggregateCreditsLoading = false;
      state.getContentAggregateCreditsResult = action.payload;
    });
    builder.addCase(getContentAggregateCredits.rejected, (state, action) => {
      state.getContentAggregateCreditsLoading = false;
      state.getContentAggregateCreditsError = true;
    });

    builder.addCase(getContentRecommendations.pending, (state, action) => {
      state.getContentRecommendationsLoading = true;
      state.getContentRecommendationsResult = [];
    });
    builder.addCase(getContentRecommendations.fulfilled, (state, action) => {
      state.getContentRecommendationsLoading = false;
      state.getContentRecommendationsResult = action.payload.results;
    });
    builder.addCase(getContentRecommendations.rejected, (state, action) => {
      state.getContentRecommendationsLoading = false;
      state.getContentRecommendationsError = true;
    });
  },
});

export default content.reducer;
