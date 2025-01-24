import { useState } from "react";

import { Heart } from "react-feather";

const max36Words = (text) => {
  const words = text.split(" ");
  if (words.length <= 36) return text;
  return words.slice(0, 36).join(" ") + "...";
};

export default function Movie(movie) {
  const {
    title = '',
    original_title = '',
    year = '',
    cast = [],
    genres = [],
    poster = '',
    overview = '',
    imdb_id = '',
  } = movie;

  const [isFav, setIsFav] = useState(isInLocalStorage);
  const [isLoading, setIsLoading] = useState(false);

  async function addToFavorites() {
    try {
      setIsLoading(true);
      const favoritesInLocalStorage =
        JSON.parse(localStorage.getItem("favoriteMovies")) || [];
      const favoriteMovies = [movie, ...favoritesInLocalStorage];
      localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
      setIsFav(true);
    } catch (error) {
      console.error('failed to add movie to favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function removeFromFavorites() {
    try {
      setIsLoading(true);
      const favoritesInLocalStorage =
        JSON.parse(localStorage.getItem("favoriteMovies")) || [];
      const favoriteMovies = favoritesInLocalStorage.filter(
        (m) => m.id !== movie.id
      );
      localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
      setIsFav(false);
    } catch (error) {
      console.error('failed to remove movie from favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function isInLocalStorage() {
    const favoritesInLocalStorage =
      JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    return favoritesInLocalStorage.some((favorite) => favorite.id === movie.id);
  }

  return (
    <li className="flex flex-col relative border border-yellow-400 shadow-lg p-6 pb-2">
      <h3 className="font-semibold text-xl">
        {title} {year && <span className="font-medium text-gray-500">({year})</span>}
      </h3>
      {title !== original_title && original_title && (
        <h2 className="italic">{original_title}</h2>
      )}
      <button
        className={`absolute top-1 right-1 p-1 focus:outline-none ${isFav ? "text-red-500" : "text-gray-300"
          } hover:text-red-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={isFav ? removeFromFavorites : addToFavorites}
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <Heart fill="currentColor" />
        )}
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
        {poster && <img src={poster} alt={title} className="w-1/2 text-center m-auto" />}
        <p className="flex flex-col text-sm">
          {overview && <span>{max36Words(overview)}</span>}
          {cast.length > 0 && (
            <span className="mt-3">
              Cast:{" "}
              {cast.map((actor, index) => (
                <span key={index}>
                  {index < 4 && actor}
                  {index < 3 && ", "}
                </span>
              ))}
            </span>
          )}
          {imdb_id && (
            <a
              href={`https://www.imdb.com/title/${imdb_id}`}
              className="block mt-auto font-semibold text-blue-800 hover:opacity-75"
            >
              View on{" "}
              <img src="/imdb_logo.png" className="inline pb-1 w-10" alt="IMDB" />
            </a>
          )}
        </p>
      </div>
    </li>
  );
}
