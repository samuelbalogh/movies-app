import { useState, useCallback } from "react";
import ReactTooltip from "react-tooltip";

import { filters } from "./filters";

export default function Filters({ onChange, onSearch, filter, showFavorites }) {
  const [searchValue, setSearchValue] = useState(
    filter.match(/search=.+/g) ? filter.match(/(search=)(.+)/)[2] : ""
  );

  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch({ target: { value } });
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <>
      <button
        className="bg-green-600 p-2 rounded text-white font-medium mb-4 mr-2"
        onClick={onChange}
        data-value="all"
      >
        All movies
      </button>
      <button
        className="bg-pink-200 p-2 rounded font-medium mb-4 mr-2"
        onClick={showFavorites}
      >
        My favorites
      </button>
      {filters.map(({ text, value, tooltip }) => (
        <button
          key={text}
          className="bg-gray-300 p-2 rounded font-medium mb-4 mr-2"
          onClick={onChange}
          data-value={value}
          data-tip={tooltip}
          data-delay-show="700"
          data-type="light"
        >
          {text}
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
