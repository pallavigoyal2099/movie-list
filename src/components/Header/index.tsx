import React, { useEffect } from "react";
import type { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addMovieGenre, changeGenre } from "../../redux/moviesSlice";
import "./Header.css";
import MovieIcon from "../../assets/Group.svg";

const Header = () => {
  const genreList = useSelector((state: RootState) => state.movies.movieGenre);
  const selectedGenres = useSelector(
    (state: RootState) => state.movies.selectedGenres
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://api.themoviedb.org/3/genre/movie/list",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        dispatch(addMovieGenre(response.data.genres));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="header">
      <div className="header-logo">
        <img src={MovieIcon} alt="movie-logo" />
      </div>
      <div className="genres">
        {genreList?.map(({ id, name }) => {
          return (
            <button
              className={`genre ${
                selectedGenres.includes(id) ? "selected" : ""
              }`}
              onClick={() => dispatch(changeGenre(id))}
              key={id}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
