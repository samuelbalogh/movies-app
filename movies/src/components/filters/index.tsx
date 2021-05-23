import { DebounceInput } from "react-debounce-input";
import ReactTooltip from "react-tooltip";

import { filters } from "./filters";

export default function Filters({ onChange, onSearch, filter, showFavorites }) {
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

      <DebounceInput
        className="p-3 m-2 border border-yellow-400 shadow w-72"
        placeholder="Search by year, actor, title, etc..."
        minLength={2}
        debounceTimeout={300}
        onChange={onSearch}
        value={
          filter.match(/search=.+/g) ? filter.match(/(search=)(.+)/)[2] : ""
        }
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
