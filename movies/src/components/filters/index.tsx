import { useState, useCallback } from "react";
import ReactTooltip from "react-tooltip";

import { filters } from "./filters";

export default function Filters({ onChange, onSearch, filter, showFavorites }) {
  const [searchValue, setSearchValue] = useState(
    filter.match(/search=.+/g) ? filter.match(/(search=)(.+)/)[2] : ""
  );
  const [loadingFilter, setLoadingFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch({ target: { value } });
    }, 300),
    []
  );

  const handleFilterClick = async (e) => {
    const value = e.currentTarget.dataset.value;
    setLoadingFilter(value);
    setActiveFilter(value);

    const startTime = Date.now();

    if (value === 'favorites') {
      await showFavorites();
    } else {
      await onChange(e);
    }

    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 80 - elapsedTime);

    await new Promise(resolve => setTimeout(resolve, remainingTime));
    setLoadingFilter("");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const getButtonClasses = (value) => {
    const baseClasses = "p-2 rounded font-medium mb-4 mr-2 relative";
    const colorClasses = {
      all: "bg-green-600 text-white",
      favorites: "bg-pink-200",
      default: "bg-gray-300"
    };
    const activeClasses = activeFilter === value ? "ring-2 ring-blue-500" : "";
    const loadingClasses = loadingFilter === value ? "opacity-70" : "";

    return `${baseClasses} ${colorClasses[value] || colorClasses.default} ${activeClasses} ${loadingClasses}`;
  };

  return (
    <>
      <button
        className={getButtonClasses("all")}
        onClick={handleFilterClick}
        data-value="all"
      >
        All movies
        {loadingFilter === "all" && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        )}
      </button>
      <button
        className={getButtonClasses("favorites")}
        onClick={handleFilterClick}
        data-value="favorites"
      >
        My favorites
        {loadingFilter === "favorites" && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        )}
      </button>
      {filters.map(({ text, value, tooltip }) => (
        <button
          key={text}
          className={getButtonClasses(value)}
          onClick={handleFilterClick}
          data-value={value}
          data-tip={tooltip}
          data-delay-show="700"
          data-type="light"
        >
          {text}
          {loadingFilter === value && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
          )}
        </button>
      ))}

      <input
        className="p-3 m-2 border border-yellow-400 shadow w-72"
        placeholder="Search by year, actor, title, etc..."
        minLength={2}
        value={searchValue}
        onChange={handleSearchChange}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
      <ReactTooltip />
    </>
  );
}

// utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
