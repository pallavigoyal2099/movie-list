import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMovies, Movie } from "../../redux/moviesSlice";
import { RootState } from "../../redux/store";
import "./movies.css";
import MovieCard from "../MovieCard";
import Loading from "../Loading";
const filterMoviesByGenres = (movies: Movie[], selectedGenres: number[]) => {
  if (selectedGenres.includes(0)) {
    return movies;
  } else {
    return movies.filter((movie) =>
      movie.genre_ids.some((genreId: number) =>
        selectedGenres.includes(genreId)
      )
    );
  }
};
const Movies = () => {
  const dispatch = useDispatch();
  const [topYear, setTopYear] = useState(2012);
  const [bottomYear, setBottomYear] = useState(2012);
  const selectedGenres = useSelector(
    (state: RootState) => state.movies.selectedGenres
  );
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const movies = useSelector((state: RootState) => state.movies.movies);


  const fetchMovies = async (year: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie`,
        {
          params: {
            api_key: "2dca580c2a14b55200e784d157207b4d",
            sort_by: "popularity.desc",
            primary_release_year: year,
            page: 1,
            vote_count: 100,
          },
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
          },
        }
      );

      const moviesByYear = {
        [year]: response.data.results,
      };

      dispatch(addMovies(moviesByYear));
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(2012); // Initial fetch for 2012
  }, []);


  const handleScroll = () => {
    if (containerRef.current) {
      const{scrollTop,scrollHeight,clientHeight}=containerRef.current;
      const difference = Math.round(scrollHeight - scrollTop - clientHeight);
      const tolerance = 1;
      if (difference <= tolerance) {
        setBottomYear(bottomYear +1);
        fetchMovies(bottomYear +1);
      } else if (scrollTop === 0) {
        setTopYear(topYear - 1);
        fetchMovies(topYear - 1);
      }
    }
  };

  return (
    <>
        <div
          ref={containerRef}
          onScroll={handleScroll}
          style={{ overflowY: 'scroll', height: '100vh', }}
        >
          {Object.keys(movies).map((year) => {
            const filteredMovies = filterMoviesByGenres(
              movies[year],
              selectedGenres
            );
            const numericYear = Number(year);
            return (
              <div key={numericYear}>
                <h2 className="movie-year">{numericYear}</h2>
                <div className="movie-list">
                  {filteredMovies.length === 0 ? (
                    <div className="no-movies">
                      No movies in this year for selected genre
                    </div>
                  ) : (
                    filteredMovies?.map(
                      (movie: {
                        id: React.Key | null | undefined;
                        title: string;
                        poster_path: any;
                        overview: string;
                        genre_ids: number[];
                      }) => (
                        <MovieCard
                          key={movie.id}
                          title={movie.title}
                          image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                          overview={movie.overview}
                          genres={movie.genre_ids}
                        />
                      )
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
    </>
  );
};

export default Movies;
