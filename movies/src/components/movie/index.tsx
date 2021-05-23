const max36Words = (text) => {
  const words = text.split(" ");
  if (words.length <= 36) return text;
  return words.slice(0, 36).join(" ") + "...";
};

export default function Movie({
  title,
  original_title,
  year,
  cast,
  genres,
  poster,
  overview,
  imdb_id,
}) {
  return (
    <li className="flex flex-col border border-yellow-400 shadow-lg p-6 pb-2">
      <h3 className="font-semibold text-xl">
        {title} <span className="font-medium text-gray-500">({year})</span>
      </h3>
      {title !== original_title && <h2 className="italic">{original_title}</h2>}
      {genres && genres.length > 0 && (
        <p className="my-2 text-gray-500">
          {genres.map((t, i) => (
            <span className="inline">
              {t}
              {i !== genres.length - 1 && ", "}
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
            {cast.map((t, i) => (
              <span>
                {i < 4 && t}
                {i < 3 && ", "}
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
