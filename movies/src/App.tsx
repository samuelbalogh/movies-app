import React, {useState, useEffect } from 'react';

import { DebounceInput } from 'react-debounce-input'

const ENDPOINT = 'http://localhost:5000/'

function App() {
  const [movies, setMovies] = useState([])
  const [filter, setFilter] = useState('')

  const limit = 100
  const offset = 0

  const filters = [
    {
      text: 'Most popular movies',
      value: 'popular'
    },
    {
      text: '70s movies',
      value: '70s'
    },
    {
      text: '80s movies',
      value: '80s'
    },
    {
      text: '90s movies',
      value: '90s'
    },
    {
      text: 'Dramas',
      value: 'dramas'
    },
    {
      text: 'Documentaries',
      value: 'documentaries'
    },
    {
      text: 'New movies',
      value: 'new'
    },   
    {
      text: 'Science-fiction movies',
      value: 'sci-fi'
    },
    {
      text: 'Big budget movies',
      value: 'big-budget'
    },
    {
      text: 'Most profitable movies',
      value: 'profitable'
    },
    {
      text: 'Highest grossing movies',
      value: 'grossing'
    },
  ]

  useEffect(() => {
    let url = `${ENDPOINT}${filter}`
    if (url.indexOf('?') == -1) {
      url = `${url}?offset=${offset}&limit=${limit}`
    } else {
      url = `${url}&offset=${offset}&limit=${limit}`
    }
    fetch(url, {
        credentials: 'same-origin',
      })
      .then(async response => {
	      const data = await response.json()
          if (response.ok) {
            if (data === null || data === undefined ) {
              setMovies([])
            } else {
              setMovies(data)
            }}
          }).catch(error => {
          console.error(error)
        })
  }, [filter])

  const handleFilterChange = (e) => {
    const filter = `${e.target.dataset.value}`
    setFilter(filter)
  }

  const handleSearchChange = (e) => {
    const filter = `${e.target.value}`
    setFilter(`?search=${filter}`)
  }

  return (
    <div className="container mx-auto">
      <header className="App-header">
      <h2 className="text-3xl font-bold text-center text-blue-600 my-6">Our movie database</h2>
      {filters.map(({ text, value }) => (
        <button 
          className="bg-blue-600 p-2 rounded text-white font-medium mb-6 mr-2" 
          onClick={handleFilterChange}
          data-value={value}
        >
          {text}
        </button>
      ))}

      <DebounceInput
        className="p-3 m-2 border border-yellow-400 shadow"
        placeholder='Search'
        minLength={2}
        debounceTimeout={300}
        onChange={handleSearchChange}
        value={filter.match(/search=.+/g) ? filter.match(/(search=)(.+)/)[2] : ''}
        onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault() } }}
      />

      </header>
      <ul className="md:grid grid-col grid-cols-3 gap-4">
        
        {movies.map(({ title, year, cast, genres, poster, overview }) => 
          <li className="border border-yellow-200 shadow pl-12 pr-12 pt-2">
            <h3 className="px-4 font-semibold">{title}</h3>
            <p className="px-4">{year}</p>
            {genres && genres.length > 0 &&
            <p className="px-4">Genres:  {' '}
              {genres.map((t,i) => <span className="inline">{t}{
                  i!==genres.length-1 && ', '
              }</span>)}
            </p>}
            {poster && 
              <img src={poster} className="p-4 max-h-xs text-center m-auto"/>
            }
            <p className="pb-4" >{overview}</p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default App;
