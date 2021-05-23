import { useState } from "react";

import { Heart } from "react-feather";

const max36Words = (text) => {
  const words = text.split(" ");
  if (words.length <= 36) return text;
  return words.slice(0, 36).join(" ") + "...";
};

export default function Movie(movie) {
  const {
    title,
    original_title,
    year,
    cast,
    genres,
    poster,
    overview,
    imdb_id,
  } = movie;

  const [isFav, setIsFav] = useState(isInLocalStorage);

  function addToFavorites() {
    const favoritesInLocalStorage =
      JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    const favoriteMovies = [movie, ...favoritesInLocalStorage];
    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
    setIsFav(true);
  }

  function removeFromFavorites() {
    const favoritesInLocalStorage =
      JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    const favoriteMovies = favoritesInLocalStorage.filter(
      (m) => m.id !== movie.id
    );
    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
    setIsFav(false);
  }

  function isInLocalStorage() {
    const favoritesInLocalStorage =
      JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    return favoritesInLocalStorage.some((favorite) => favorite.id === movie.id);
  }

  return (
    <li className="flex flex-col relative border border-yellow-400 shadow-lg p-6 pb-2">
      <h3 className="font-semibold text-xl">
        {title} <span className="font-medium text-gray-500">({year})</span>
      </h3>
      {title !== original_title && <h2 className="italic">{original_title}</h2>}
      <button
        className={`absolute top-1 right-1 p-1 focus:outline-none ${
          isFav ? "text-red-500" : "text-gray-300"
        } hover:text-red-500`}
        onClick={isFav ? removeFromFavorites : addToFavorites}
      >
        <Heart fill="currentColor" />
        <span className="sr-only">Add to favorites</span>
      </button>
      {genres && genres.length > 0 && (
        <p className="my-2 text-gray-500">
          {genres.map((genre, index) => (
            <span className="inline" key={index}>
              {genre}
              {index !== genres.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}
      <div className="flex my-5 mt-auto space-x-4">
        {poster && <img src={poster} className="w-1/2 text-center m-auto" />}
        <p className="flex flex-col text-sm">
          <span>{max36Words(overview)}</span>
          <span className="mt-3">
            Cast:{" "}
            {cast.map((actor, index) => (
              <span key={index}>
                {index < 4 && actor}
                {index < 3 && ", "}
              </span>
            ))}
          </span>
          <a
            href={"https://www.imdb.com/title/" + imdb_id}
            className="block mt-auto font-semibold text-blue-800 hover:opacity-75"
          >
            View on{" "}
            <img src="/imdb_logo.png" className="inline pb-1 w-10" alt="IMDB" />
          </a>
        </p>
      </div>
    </li>
  );
}
