import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tmdbClient } from "../api/axiosClients";
import { Serie } from "../types/serie";

type InitialState = {
  getTurkishTVSeriesLoading: boolean;
  getTurkishTVSeriesResult: Serie[];
  getTurkishTVSeriesError: boolean;

  getSpainTVSeriesLoading: boolean;
  getSpainTVSeriesResult: Serie[];
  getSpainTVSeriesError: boolean;

  getTVSerieDetailLoading: boolean;
  getTVSerieDetailResult: [];
  getTVSerieDetailError: boolean;

  getTVSerieVideosLoading: boolean;
  getTVSerieVideosResult: [];
  getTVSerieVideosError: boolean;

  getTVSerieImagesLoading: boolean;
  getTVSerieImagesResult: [];
  getTVSerieImagesError: boolean;

  getTVSerieAggregateCreditsLoading: boolean;
  getTVSerieAggregateCreditsResult: [];
  getTVSerieAggregateCreditsError: boolean;

  getTVSeriePopular10Loading: boolean;
  getTVSeriePopular10Result: Serie[];
  getTVSeriePopular10Error: boolean;
};

const initialState: InitialState = {
  getTurkishTVSeriesLoading: false,
  getTurkishTVSeriesResult: [],
  getTurkishTVSeriesError: false,

  getSpainTVSeriesLoading: false,
  getSpainTVSeriesResult: [],
  getSpainTVSeriesError: false,

  getTVSerieDetailLoading: false,
  getTVSerieDetailResult: [],
  getTVSerieDetailError: false,

  getTVSerieVideosLoading: false,
  getTVSerieVideosResult: [],
  getTVSerieVideosError: false,

  getTVSerieImagesLoading: false,
  getTVSerieImagesResult: [],
  getTVSerieImagesError: false,

  getTVSerieAggregateCreditsLoading: false,
  getTVSerieAggregateCreditsResult: [],
  getTVSerieAggregateCreditsError: false,

  getTVSeriePopular10Loading: false,
  getTVSeriePopular10Result: [],
  getTVSeriePopular10Error: false,
};

export const getTurkishTVSeries = createAsyncThunk(
  "getTurkishTVSeries",
  async () => {
    const response = await tmdbClient.get(
      "/discover/tv?with_original_language=tr"
    );
    return response.data;
  }
);

export const getSpainTVSeries = createAsyncThunk(
  "getSpainTVSeries",
  async () => {
    const response = await tmdbClient.get(
      "/discover/tv?with_original_language=es"
    );
    return response.data;
  }
);

export const getTVSerieDetail = createAsyncThunk(
  "getTVSerieDetail",
  async (id: string) => {
    const response = await tmdbClient.get("/tv/" + id);
    return response.data;
  }
);

export const getTVSerieVideos = createAsyncThunk(
  "getTVSerieVideos",
  async (id: string) => {
    const response = await tmdbClient.get(`/tv/${id}/videos`);
    return response.data;
  }
);

export const getTVSerieImages = createAsyncThunk(
  "getTVSerieImages",
  async (id: string) => {
    const response = await tmdbClient.get(`/tv/${id}/images`);
    return response.data;
  }
);

export const getTVSerieAggregateCredits = createAsyncThunk(
  "getTVSerieAggregateCredits",
  async (id: string) => {
    const response = await tmdbClient.get(`/tv/${id}/aggregate_credits`);
    return response.data;
  }
);

export const getTVSeriePopular10 = createAsyncThunk(
  "getTVSeriePopular10",
  async () => {
    const response = await tmdbClient.get("/tv/popular");
    return response.data.results.splice(0, 10);
  }
);

export const series = createSlice({
  name: "series",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTurkishTVSeries.pending, (state, action) => {
      state.getTurkishTVSeriesLoading = true;
    });
    builder.addCase(getTurkishTVSeries.fulfilled, (state, action) => {
      state.getTurkishTVSeriesLoading = false;
      state.getTurkishTVSeriesResult = action.payload.results.filter(
        (movie) => movie?.poster_path
      );
    });
    builder.addCase(getTurkishTVSeries.rejected, (state, action) => {
      state.getTurkishTVSeriesLoading = false;
      state.getTurkishTVSeriesError = true;
    });

    builder.addCase(getSpainTVSeries.pending, (state, action) => {
      state.getSpainTVSeriesLoading = true;
    });
    builder.addCase(getSpainTVSeries.fulfilled, (state, action) => {
      state.getSpainTVSeriesLoading = false;
      state.getSpainTVSeriesResult = action.payload.results;
    });
    builder.addCase(getSpainTVSeries.rejected, (state, action) => {
      state.getSpainTVSeriesLoading = false;
      state.getSpainTVSeriesError = true;
    });

    builder.addCase(getTVSerieDetail.pending, (state, action) => {
      state.getTVSerieDetailLoading = true;
    });
    builder.addCase(getTVSerieDetail.fulfilled, (state, action) => {
      state.getTVSerieDetailLoading = false;
      state.getTVSerieDetailResult = action.payload;
    });
    builder.addCase(getTVSerieDetail.rejected, (state, action) => {
      state.getTVSerieDetailLoading = false;
      state.getTVSerieDetailError = true;
    });

    builder.addCase(getTVSerieVideos.pending, (state, action) => {
      state.getTVSerieVideosLoading = true;
    });
    builder.addCase(getTVSerieVideos.fulfilled, (state, action) => {
      state.getTVSerieVideosLoading = false;
      state.getTVSerieVideosLoading = action.payload.results;
    });
    builder.addCase(getTVSerieVideos.rejected, (state, action) => {
      state.getTVSerieVideosLoading = false;
      state.getTVSerieVideosError = true;
    });

    builder.addCase(getTVSerieImages.pending, (state, action) => {
      state.getTVSerieImagesLoading = true;
    });
    builder.addCase(getTVSerieImages.fulfilled, (state, action) => {
      state.getTVSerieImagesLoading = false;
      state.getTVSerieImagesResult = action.payload;
    });
    builder.addCase(getTVSerieImages.rejected, (state, action) => {
      state.getTVSerieImagesLoading = false;
      state.getTVSerieImagesError = true;
    });

    builder.addCase(getTVSerieAggregateCredits.pending, (state, action) => {
      state.getTVSerieAggregateCreditsLoading = true;
    });
    builder.addCase(getTVSerieAggregateCredits.fulfilled, (state, action) => {
      state.getTVSerieAggregateCreditsLoading = false;
      state.getTVSerieAggregateCreditsResult = action.payload;
    });
    builder.addCase(getTVSerieAggregateCredits.rejected, (state, action) => {
      state.getTVSerieAggregateCreditsLoading = false;
      state.getTVSerieAggregateCreditsError = true;
    });

    builder.addCase(getTVSeriePopular10.pending, (state, action) => {
      state.getTVSeriePopular10Loading = true;
    });
    builder.addCase(getTVSeriePopular10.fulfilled, (state, action) => {
      state.getTVSeriePopular10Loading = false;
      state.getTVSeriePopular10Result = action.payload;
    });
    builder.addCase(getTVSeriePopular10.rejected, (state, action) => {
      state.getTVSeriePopular10Loading = false;
      state.getTVSeriePopular10Error = true;
    });
  },
});

export default series.reducer;
