import React, { useState, useEffect, useCallback } from "react";

import { useInView } from "react-intersection-observer";

import Filters from "./components/filters";
import Movie from "./components/movie";

const ENDPOINT =
  Boolean(process.env.REACT_APP_API_ENDPOINT) === false
    ? "http://localhost:8080/"
    : process.env.REACT_APP_API_ENDPOINT;

function App() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("");
  const [offset, setOffset] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  const { ref, inView } = useInView();

  const limit = 66;

  useEffect(() => {
    setOffset(0); // reset offset
    let url = `${ENDPOINT}${filter}`;
    if (url.indexOf("?") === -1) {
      url = `${url}?offset=0&limit=${limit}`;
    } else {
      url = `${url}&offset=0&limit=${limit}`;
    }
    fetch(url, {
      mode: 'cors',
      credentials: 'same-origin',
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          if (data === null || data === undefined) {
            setMovies([]);
          } else {
            setMovies(data);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [filter]);

  const loadMoreMovies = useCallback(() => {
    const newOffset = offset + limit;
    let url = `${ENDPOINT}${filter}`;
    if (url.indexOf("?") === -1) {
      url = `${url}?offset=${newOffset}&limit=${limit}`;
    } else {
      url = `${url}&offset=${newOffset}&limit=${limit}`;
    }
    fetch(url, {
      mode: 'cors',
      credentials: 'same-origin',
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          if (Boolean(data)) {
            setMovies((movies) => [...movies, ...data]);
            setOffset(newOffset);
            if (data.length === 0) {
              setShowLoader(false);
            }
          }
        }
      })
      .catch((error) => { });
  }, [offset, filter]);

  useEffect(() => {
    if (inView) {
      loadMoreMovies();
    }
  }, [inView]);

  const handleFilterChange = (e) => {
    const newFilter = `${e.target.dataset.value}`;
    setFilter(newFilter === "all" ? "" : newFilter);
  };

  const handleSearchChange = (e) => {
    const filter = `${e.target.value}`;
    setFilter(`?search=${filter}`);
  };

  const showFavorites = () => {
    const favs = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    setMovies(favs);
  };

  return (
    <div className="container mx-auto mb-6">
      <header className="App-header">
        <h2 className="text-3xl font-bold text-center text-blue-600 my-6">
          Super movie database
        </h2>
        <h3 className="text-xl text-center italic my-4">
          Read up about 60 000 movies
        </h3>
        <Filters
          onChange={handleFilterChange}
          filter={filter}
          onSearch={handleSearchChange}
          showFavorites={showFavorites}
        />
      </header>
      <ul className="md:grid grid-col grid-cols-3 gap-6">
        {movies.map((movie) => (
          <Movie {...movie} key={movie.id} />
        ))}
      </ul>
      {movies.length >= limit && showLoader && (
        <div className="p-10 text-center" ref={ref}>
          Loading...
        </div>
      )}
    </div>
  );
}

export default App;
