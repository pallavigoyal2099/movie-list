import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Genre {
  id: number;
  name: string;
}

  interface Movie {
    genre_ids: number[];
    id: number;
    overview: string;
    popularity: number;
    poster_path: string | null;
    title: string;
  }

export interface MovieState {
  movieGenre: Genre[];
  selectedGenres: number[];
  movies: { [year: number]: Movie[] };
}

const initialState: MovieState = {
  movieGenre: [
    {
      id: 0,
      name: "All",
    },
  ],
  selectedGenres: [0],
  movies: {},
};

export const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    addMovieGenre: (state, action) => {
      const uniqueGenres = action.payload.filter(
        (genre: { id: number }) =>
          !state.movieGenre.some(
            (existingGenre) => existingGenre.id === genre.id
          )
      );
      state.movieGenre = [...state.movieGenre, ...uniqueGenres];
    },
    changeGenre: (state, action) => {
      const genreId = action.payload;
      const index = state.selectedGenres.indexOf(genreId);
      if (index !== -1) {
        state.selectedGenres = state.selectedGenres.filter(
          (id) => id !== genreId
        );
      } else {
        state.selectedGenres = [...state.selectedGenres, genreId];
      }
    },
    addMovies: (state,action: PayloadAction<{ [year: number]: Movie[] }>) => {
      const year = Object.keys(action.payload)[0];
      const yearNumber = Number(year);
      state.movies[yearNumber] = action.payload[yearNumber];
    },
  },
});

export const { addMovieGenre, changeGenre, addMovies } = movieSlice.actions;

export default movieSlice.reducer;
