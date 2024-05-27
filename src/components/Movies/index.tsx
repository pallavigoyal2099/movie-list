import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMovies } from "../../redux/moviesSlice";
import { RootState } from "../../redux/store";
import "./movies.css";
import MovieCard from "../MovieCard";

const Movies = () => {
  const dispatch = useDispatch();
  const [year, setYear] = useState<number>(2012);
  const selectedGenres = useSelector(
    (state: RootState) => state.movies.selectedGenres
  );
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const movies = useSelector((state: RootState) => state.movies.movies);


  console.log('n',movies)
  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [dispatch, year]);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight;
      const clientHeight = containerRef.current.clientHeight;
      const difference = Math.round(scrollHeight - scrollTop - clientHeight);
      const tolerance = 1;
      if (difference <= tolerance) {
        setYear(year + 1);
      } else if (scrollTop === 0) {
        setYear(year - 1);
      }
    }
  };
//   const filteredMovies = movies.filter((movie) => {
//     if (selectedGenres.includes(0)) {
//       return true;
//     } else {
//       return movie.genre_ids.some((genreId: number) =>
//         selectedGenres.includes(genreId)
//       );
//     }
//   });

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ overflowY: "scroll", height: "500px" }}

    >
         {Object.keys(movies).map((year) => {
        const numericYear = Number(year);
        return (
          <div key={numericYear}>
            <h2 className="movie-year">{numericYear}</h2>
            <div className="movie-list">
              {movies[numericYear]?.map((movie) => (
                <MovieCard
                key={movie.id}
                title={movie.title}
                image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                overview={movie.overview}
                genres={movie.genre_ids}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Movies;
