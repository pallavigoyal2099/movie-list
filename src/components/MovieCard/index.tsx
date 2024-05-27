import React from "react";
import "./movieCard.css";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface Movie {
  title: string;
  image: string;
  genres: number[];
  overview: string;
}

const MovieCard = ({ title, image, genres, overview }: Movie) => {
  const genreList = useSelector((state: RootState) => state.movies.movieGenre);
  const mapGenreNames = (genreIds: number[]) => {
    return genreIds.map((id: number) => {
      const genre = genreList.find((genre) => genre.id === id);
      return genre ? genre.name : "";
    });
  };

  return (
    <div className="movie-card">
      <img src={image} alt={title} />
      <h2>{title}</h2>

      <p>
        <strong>Overview:</strong> {overview}
      </p>
      <div className="genre-list">
        {mapGenreNames(genres)?.map((genre, id) => (
          <span key={id} className="genrecard">
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MovieCard;
