import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tmdbClient } from "../api/axiosClients";
import { Movie } from "../types/movie";

type InitialState = {
  getNewReleasesLoading: boolean;
  getNewReleasesResult: Movie[];
  getNewReleasesError: boolean;

  getNowPlayingLoading: boolean;
  getNowPlayingResult: Movie[];
  getNowPlayingError: boolean;

  getUpcomingLoading: boolean;
  getUpcomingResult: Movie[];
  getUpcomingError: boolean;

  getPopular10Loading: boolean;
  getPopular10Result: Movie[];
  getPopular10Error: boolean;

  getActionMoviesLoading: boolean;
  getActionMoviesResult: [];
  getActionMoviesError: boolean;

  getMovieDetailLoading: boolean;
  getMovieDetailResult: [];
  getMovieDetailError: boolean;

  getMovieVideosLoading: boolean;
  getMovieVideosResult: [];
  getMovieVideosError: boolean;

  getMovieImagesLoading: boolean;
  getMovieImagesResult: [];
  getMovieImagesError: boolean;

  getMovieAggregateCreditsLoading: boolean;
  getMovieAggregateCreditsResult: [];
  getMovieAggregateCreditsError: boolean;

  getRandomPopularMovieLoading: boolean;
  getRandomPopularMovieResult: Movie[];
  getRandomPopularMovieError: boolean;

  getEveryoneIsWatchingLoading: boolean;
  getEveryoneIsWatchingResult: Movie[];
  getEveryoneIsWatchingError: boolean;
};

const initialState: InitialState = {
  getNewReleasesLoading: false,
  getNewReleasesResult: [],
  getNewReleasesError: false,

  getNowPlayingLoading: false,
  getNowPlayingResult: [],
  getNowPlayingError: false,

  getUpcomingLoading: false,
  getUpcomingResult: [],
  getUpcomingError: false,

  getPopular10Loading: false,
  getPopular10Result: [],
  getPopular10Error: false,

  getActionMoviesLoading: false,
  getActionMoviesResult: [],
  getActionMoviesError: false,

  getMovieDetailLoading: false,
  getMovieDetailResult: [],
  getMovieDetailError: false,

  getMovieVideosLoading: false,
  getMovieVideosResult: [],
  getMovieVideosError: false,

  getMovieImagesLoading: false,
  getMovieImagesResult: [],
  getMovieImagesError: false,

  getMovieAggregateCreditsLoading: false,
  getMovieAggregateCreditsResult: [],
  getMovieAggregateCreditsError: false,

  getRandomPopularMovieLoading: false,
  getRandomPopularMovieResult: [],
  getRandomPopularMovieError: false,

  getEveryoneIsWatchingLoading: false,
  getEveryoneIsWatchingResult: [],
  getEveryoneIsWatchingError: false,
};

export const getNewReleases = createAsyncThunk("getNewReleases", async () => {
  const response = await tmdbClient.get("/discover/movie");
  return response.data;
});

export const getNowPlaying = createAsyncThunk("getNowPlaying", async () => {
  const response = await tmdbClient.get("/movie/now_playing");
  return response.data;
});

export const getUpcoming = createAsyncThunk("getUpcoming", async () => {
  const response = await tmdbClient.get("/movie/upcoming");
  return response.data;
});

export const getPopular10 = createAsyncThunk("getPopular10", async () => {
  const response = await tmdbClient.get("/movie/popular");
  return response.data;
});

export const getActionMovies = createAsyncThunk("getActionMovies", async () => {
  const response = await tmdbClient.get("/discover/movie?with_genres=28");
  return response.data;
});

export const getMovieDetail = createAsyncThunk(
  "getMovieDetail",
  async (id: string) => {
    const response = await tmdbClient.get("/movie/" + id);
    return response.data;
  }
);

export const getMovieVideos = createAsyncThunk(
  "getMovieVideos",
  async (id: string) => {
    const response = await tmdbClient.get(`/movie/${id}/videos`);
    return response.data;
  }
);

export const getMovieImages = createAsyncThunk(
  "getMovieImages",
  async (id: string) => {
    const response = await tmdbClient.get(`/movie/${id}/images`);
    return response.data;
  }
);

export const getMovieAggregateCredits = createAsyncThunk(
  "getMovieAggregateCredits",
  async (id: string) => {
    const response = await tmdbClient.get(`/movie/${id}/aggregate_credits`);
    return response.data;
  }
);

export const getRandomPopularMovie = createAsyncThunk(
  "getRandomPopularMovie",
  async () => {
    const page = Math.floor(Math.random() * 20) + 1;
    const response = await tmdbClient.get(`/movie/popular?page=${page}`);
    const resultLength = response.data.results?.length;
    const randomItem = Math.floor(Math.random() * resultLength) + 1;
    return response.data.results[randomItem];
  }
);

export const getEveryoneIsWatching = createAsyncThunk(
  "getEveryoneIsWatching",
  async () => {
    const response = await tmdbClient.get(
      `/discover/movie?vote_count.gte=1000`
    );
    return response.data;
  }
);

export const movies = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNewReleases.pending, (state, action) => {
      state.getNewReleasesLoading = true;
    });
    builder.addCase(getNewReleases.fulfilled, (state, action) => {
      state.getNewReleasesLoading = false;
      state.getNewReleasesResult = action.payload.results.filter(
        (movie) => movie?.poster_path
      );
    });
    builder.addCase(getNewReleases.rejected, (state, action) => {
      state.getNewReleasesLoading = false;
      state.getNewReleasesError = true;
    });

    builder.addCase(getNowPlaying.pending, (state, action) => {
      state.getNowPlayingLoading = true;
    });
    builder.addCase(getNowPlaying.fulfilled, (state, action) => {
      state.getNowPlayingLoading = false;
      state.getNowPlayingResult = action.payload.results;
    });
    builder.addCase(getNowPlaying.rejected, (state, action) => {
      state.getNowPlayingLoading = false;
      state.getNowPlayingError = true;
    });

    builder.addCase(getPopular10.pending, (state, action) => {
      state.getPopular10Loading = true;
    });
    builder.addCase(getPopular10.fulfilled, (state, action) => {
      state.getPopular10Loading = false;
      state.getPopular10Result = action.payload.results.slice(0, 10);
    });
    builder.addCase(getPopular10.rejected, (state, action) => {
      state.getPopular10Loading = false;
      state.getPopular10Error = true;
    });

    builder.addCase(getUpcoming.pending, (state, action) => {
      state.getUpcomingLoading = true;
    });
    builder.addCase(getUpcoming.fulfilled, (state, action) => {
      state.getUpcomingLoading = false;
      state.getUpcomingResult = action.payload.results
        ?.filter((movie) => movie?.poster_path)
        ?.slice(0, 10);
    });
    builder.addCase(getUpcoming.rejected, (state, action) => {
      state.getUpcomingLoading = false;
      state.getUpcomingError = true;
    });

    builder.addCase(getActionMovies.pending, (state, action) => {
      state.getActionMoviesLoading = true;
    });
    builder.addCase(getActionMovies.fulfilled, (state, action) => {
      state.getActionMoviesLoading = false;
      state.getActionMoviesResult = action.payload.results;
    });
    builder.addCase(getActionMovies.rejected, (state, action) => {
      state.getActionMoviesLoading = false;
      state.getActionMoviesError = true;
    });

    builder.addCase(getMovieDetail.pending, (state, action) => {
      state.getMovieDetailLoading = true;
    });
    builder.addCase(getMovieDetail.fulfilled, (state, action) => {
      state.getMovieDetailLoading = false;
      state.getMovieDetailResult = action.payload.results;
    });
    builder.addCase(getMovieDetail.rejected, (state, action) => {
      state.getMovieDetailLoading = false;
      state.getMovieDetailError = true;
    });

    builder.addCase(getMovieVideos.pending, (state, action) => {
      state.getMovieVideosLoading = true;
    });
    builder.addCase(getMovieVideos.fulfilled, (state, action) => {
      state.getMovieVideosLoading = false;
      state.getMovieVideosResult = action.payload.results;
    });
    builder.addCase(getMovieVideos.rejected, (state, action) => {
      state.getMovieVideosLoading = false;
      state.getMovieVideosError = true;
    });

    builder.addCase(getRandomPopularMovie.pending, (state, action) => {
      state.getRandomPopularMovieLoading = true;
    });
    builder.addCase(getRandomPopularMovie.fulfilled, (state, action) => {
      state.getRandomPopularMovieLoading = false;
      state.getRandomPopularMovieResult = action.payload;
    });
    builder.addCase(getRandomPopularMovie.rejected, (state, action) => {
      state.getRandomPopularMovieLoading = false;
      state.getRandomPopularMovieError = true;
    });

    builder.addCase(getMovieImages.pending, (state, action) => {
      state.getMovieImagesLoading = true;
    });
    builder.addCase(getMovieImages.fulfilled, (state, action) => {
      state.getMovieImagesLoading = false;
      state.getMovieImagesResult = action.payload;
    });
    builder.addCase(getMovieImages.rejected, (state, action) => {
      state.getMovieImagesLoading = false;
      state.getMovieImagesError = true;
    });

    builder.addCase(getMovieAggregateCredits.pending, (state, action) => {
      state.getMovieAggregateCreditsLoading = true;
    });
    builder.addCase(getMovieAggregateCredits.fulfilled, (state, action) => {
      state.getMovieAggregateCreditsLoading = false;
      state.getMovieAggregateCreditsResult = action.payload;
    });
    builder.addCase(getMovieAggregateCredits.rejected, (state, action) => {
      state.getMovieAggregateCreditsLoading = false;
      state.getMovieAggregateCreditsError = true;
    });

    builder.addCase(getEveryoneIsWatching.pending, (state, action) => {
      state.getEveryoneIsWatchingLoading = true;
    });
    builder.addCase(getEveryoneIsWatching.fulfilled, (state, action) => {
      state.getEveryoneIsWatchingLoading = false;
      state.getEveryoneIsWatchingResult = action.payload.results.filter(
        (movie) => movie?.poster_path
      );
    });
    builder.addCase(getEveryoneIsWatching.rejected, (state, action) => {
      state.getEveryoneIsWatchingLoading = false;
      state.getEveryoneIsWatchingError = true;
    });
  },
});

export default movies.reducer;
