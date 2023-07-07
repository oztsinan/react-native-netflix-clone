import { configureStore } from "@reduxjs/toolkit";
import movies from "./movies";
import series from "./series";
import person from "./person";
import content from "./content";

const rootReducer = {
  movies,
  series,
  person,
  content,
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
