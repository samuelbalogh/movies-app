import React, { useState, useEffect, useCallback } from 'react';

import { DebounceInput } from 'react-debounce-input'
import { useInView } from 'react-intersection-observer';


const ENDPOINT = 'http://localhost:5000/'

function App() {
  const [movies, setMovies] = useState([])
  const [filter, setFilter] = useState('')
  const [offset, setOffset] = useState(0)

  const { ref, inView } = useInView()

  const limit = 33

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
    {
      text: 'French movies',
      value: 'french'
    },
  ]

  useEffect(() => {
    setOffset(0)  // reset offset
    let url = `${ENDPOINT}${filter}`
    if (url.indexOf('?') === -1) {
      url = `${url}?offset=0&limit=${limit}`
    } else {
      url = `${url}&offset=0&limit=${limit}`
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

  const loadMoreMovies = useCallback(() => {
    const newOffset = offset + limit
    let url = `${ENDPOINT}${filter}`
    if (url.indexOf('?') === -1) {
      url = `${url}?offset=${newOffset}&limit=${limit}`
    } else {
      url = `${url}&offset=${newOffset}&limit=${limit}`
    }
    fetch(url, {
        credentials: 'same-origin',
      })
      .then(async response => {
	      const data = await response.json()
          if (response.ok) {
            if (Boolean(data)) {
              setMovies([...movies, ...data])
              setOffset(newOffset)
            }}
          }).catch(error => {
        })
  }, [offset, filter])

  useEffect(() => {
    if (inView) {
      loadMoreMovies()
    }
  }, [inView])

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
      <ul className="md:grid grid-col grid-cols-3 gap-6">
        
        {movies.map(({ title, original_title, year, cast, genres, poster, overview, imdb_id }) => 
          <li className="border border-yellow-400 shadow-lg p-6">
            <h3 className="px-4 font-semibold text-xl">{title}</h3>
            { title !== original_title && 
              <h2 className="px-4 italic">{original_title}</h2>
            }
            <p className="px-4 float-right">{year}</p>
            {genres && genres.length > 0 &&
            <p className="px-4">Genres:  {' '}
              {genres.map((t,i) => <span className="inline">{t}{
                  i!==genres.length-1 && ', '
              }</span>)}
            </p>}
            {poster && 
              <img src={poster} className="p-4 max-h-xs text-center m-auto"/>
            }
            <p className="px-4 text-center mb-4">
              <a href={"https://www.imdb.com/title/" + imdb_id}>
                View on <img src="/imdb_logo.png" className="inline pb-1 w-10" alt="IMDB" />
              </a>
            </p>
            <p className="pb-4" >{overview}</p>
          </li>
        )}
      </ul>
      {movies.length >= limit &&
        <div className="p-10 text-center" ref={ref}>Loading...</div>
      }
    </div>
  );
}

export default App;
