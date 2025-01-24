import os
import json
import gzip
import logging
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ENDPOINT = "https://api.themoviedb.org/3/search/movie"

API_KEY = os.getenv('TMDB_API_KEY') or "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDAyMDUwZTU0NWM1ZDY5MzMxNDQxODNkM2EwNjg1ZSIsInN1YiI6IjYwOTZkMmM0YjJlMDc0MDAzYjZmZDczZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._8Kaq74JsWooBPykLOjDsT2F775EP48o9dlf_ZLD3P4"

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json;charset=utf-8'
}

BASE_URL = 'https://image.tmdb.org/t/p'

MOVIE_ENDPOINT = "https://api.themoviedb.org/3/movie"

MOVIES_TO_FETCH = 300

URL_PREFIX = 'https://files.tmdb.org/p/exports/'

MOVIE_ID_FILE_OF_THE_DAY = f'movie_ids_{datetime.now().strftime("%m_%d_%Y")}.json.gz'
MOVIE_ID_FILE_OF_THE_DAY_UNCOMPRESSED = f'movie_ids_{datetime.now().strftime("%m_%d_%Y")}.json'

def download_movie_ids():
    logger.info(f'Downloading movie IDs from {URL_PREFIX}{MOVIE_ID_FILE_OF_THE_DAY}')
    resp = requests.get(f'{URL_PREFIX}{MOVIE_ID_FILE_OF_THE_DAY}', headers=headers)
    with open(MOVIE_ID_FILE_OF_THE_DAY, 'wb') as f:
        f.write(resp.content)
    logger.info('Movie IDs downloaded successfully')
        
def uncompress_movie_ids():
    logger.info(f'Uncompressing movie IDs from {MOVIE_ID_FILE_OF_THE_DAY}')
    with gzip.open(MOVIE_ID_FILE_OF_THE_DAY, 'rb') as compressed_file:
        with open(MOVIE_ID_FILE_OF_THE_DAY_UNCOMPRESSED, 'w') as uncompressed_file:
            for line in compressed_file:
                movie_data = json.loads(line)
                uncompressed_file.write(json.dumps(movie_data) + '\n')
    logger.info('Movie IDs uncompressed successfully')

def load_url(url):
    resp = requests.get(url, headers=headers)
    return resp.json()


def get_all_movies():
    logger.info('Starting movie data collection process')
    urls = []
    download_movie_ids()
    uncompress_movie_ids()

    logger.info('Reading movie IDs from uncompressed file')
    
    with open(MOVIE_ID_FILE_OF_THE_DAY_UNCOMPRESSED, 'r') as movie_ids_file:
        # TODO don't read whole file into memory
        for line in movie_ids_file:
            movie = json.loads(line)
            url = f'{MOVIE_ENDPOINT}/{movie["id"]}'
            urls.append({'url': url, 'popularity': movie['popularity']})

    logger.info(f'Found {len(urls)} movies in total')
    logger.info('Sorting movies by popularity')
    urls = sorted(urls, key=lambda movie: movie['popularity'], reverse=True)[:MOVIES_TO_FETCH]
    logger.info(f'Selected top {MOVIES_TO_FETCH} movies for processing')

    all_movies = []
    actors = {}

    logger.info('Starting movie details collection with thread pool')
    with ThreadPoolExecutor(max_workers=30) as movie_executor:
        future_to_url = {movie_executor.submit(load_url, movie['url']): movie['url'] for movie in urls}
        movies_fetched = 0
        for future in as_completed(future_to_url):
            try:
                data = future.result()
                
                if 'porn' in data['title'].lower():
                    logger.warning(f'Skipping inappropriate content: {data["title"]}')
                    continue

                cast_url = f'{MOVIE_ENDPOINT}/{data["id"]}/credits'
                actors[data['id']] = cast_url

                movies_fetched += 1

                data['poster'] = f'{BASE_URL}/w200/{data["poster_path"]}'
                data['genres'] = [i['name'] for i in data['genres']]
                data['year'] = data['release_date'].split('-')[0]
                del data['adult']
                all_movies.append(data)
                if movies_fetched % 10 == 0:
                    logger.info(f'Progress: {movies_fetched}/{MOVIES_TO_FETCH} movies fetched')
            except Exception as e:
                logger.error(f'Error fetching movie details: {str(e)}')
                continue

    logger.info('Starting cast and crew information collection')
    with ThreadPoolExecutor(max_workers=30) as actor_executor:
        cast_counter = 0
        future_to_movie_id = {actor_executor.submit(load_url, cast_url): movie_id for movie_id, cast_url in actors.items()}
        for future in as_completed(future_to_movie_id):
            try:
                data = future.result()
                cast_counter += 1
                movie_id = future_to_movie_id[future]
                for movie in all_movies:
                    if movie['id'] == movie_id:
                        movie['cast'] = [actor['name'] for actor in data['cast']]
                        movie['crew'] = [crew['name'] for crew in data['crew']]

                if cast_counter % 10 == 0:
                    logger.info(f'Progress: {cast_counter}/{len(actors)} cast information fetched')
            except Exception as e:
                logger.error(f'Error fetching cast details for movie {movie_id}: {str(e)}')
                continue

    logger.info(f'Writing {len(all_movies)} movies to result file')
    with open(f'result_{MOVIES_TO_FETCH}.json', 'w') as result_file:
        json.dump(all_movies, result_file)
    logger.info('Movie data collection completed successfully')

if __name__ == "__main__":
    get_all_movies()

