import React, { useState, useEffect, useCallback } from 'react';

import { DebounceInput } from 'react-debounce-input'
import { useInView } from 'react-intersection-observer';


const ENDPOINT = process.env.REACT_APP_API_ENDPOINT

function App() {
  const [movies, setMovies] = useState([])
  const [filter, setFilter] = useState('')
  const [offset, setOffset] = useState(0)
  const [showLoader, setShowLoader] = useState(true)

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
              if (data.length === 0) {
                setShowLoader(false)
              }
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
    const newFilter = `${e.target.dataset.value}`
    setFilter(newFilter === 'all' ? '' : newFilter)
  }

  const handleSearchChange = (e) => {
    const filter = `${e.target.value}`
    setFilter(`?search=${filter}`)
  }

  const max36Words = (text) => {
    const words = text.split(' ')
    if (words.length <= 36) return text
    return words.slice(0, 36).join(' ') + '...' 
  }

  return (
    <div className="container mx-auto mb-6">
      <header className="App-header">
      <h2 className="text-3xl font-bold text-center text-blue-600 my-6">Super movie database</h2>
      <button 
        className="bg-green-600 p-2 rounded text-white font-medium mb-6 mr-2" 
        onClick={handleFilterChange}
        data-value="all"
      >
        All movies
      </button>
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
          <li className="flex flex-col border border-yellow-400 shadow-lg p-6 pb-2">
            <h3 className="font-semibold text-xl">
              {title} <span className="font-medium text-gray-500">({year})</span>
            </h3>
            { title !== original_title && 
              <h2 className="italic">{original_title}</h2>
            }
            {genres && genres.length > 0 &&
            <p className="my-2 text-gray-500">
              {genres.map((t,i) => <span className="inline">{t}{
                  i!==genres.length-1 && ', '
              }</span>)}
            </p>}
            <div className="flex my-5 mt-auto space-x-4">
              {poster && 
                <img src={poster} className="w-1/2 text-center m-auto"/>
              }
              <p className="flex flex-col text-sm">
                <span>{max36Words(overview)}</span>
                <a 
                  href={"https://www.imdb.com/title/" + imdb_id} 
                  className="block mt-auto font-semibold text-blue-800 hover:opacity-75"
                >
                  View on <img src="/imdb_logo.png" className="inline pb-1 w-10" alt="IMDB" />
                </a>
              </p>

            </div>

          </li>
        )}
      </ul>
      {movies.length >= limit && showLoader &&
        <div className="p-10 text-center" ref={ref}>Loading...</div>
      }
    </div>
  );
}

export default App;
