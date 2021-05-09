import os
import json

from concurrent.futures import ThreadPoolExecutor, as_completed

import requests


ENDPOINT = "https://api.themoviedb.org/3/search/movie"

FILE_DUMP_ENDPOINT = "http://files.tmdb.org/p/exports/movie_ids_04_28_2017.json.gz"

API_KEY = os.getenv('TMDB_API_KEY') or "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDAyMDUwZTU0NWM1ZDY5MzMxNDQxODNkM2EwNjg1ZSIsInN1YiI6IjYwOTZkMmM0YjJlMDc0MDAzYjZmZDczZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._8Kaq74JsWooBPykLOjDsT2F775EP48o9dlf_ZLD3P4"

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json;charset=utf-8'
}


BASE_URL = 'https://image.tmdb.org/t/p'

MOVIE_ENDPOINT = "https://api.themoviedb.org/3/movie"

MOVIES_TO_FETCH = 100000


def download_file_dump():
    resp = requests.get(FILE_DUMP_ENDPOINT, headers=headers)
    # TODO


def load_url(url):
    resp = requests.get(url, headers=headers)
    return resp.json()


def get_all_movies():
    urls = []

    print('reading movie ids...')

    with open('movie_ids_05_08_2021.json', 'r') as movie_ids_file:
        # TODO don't read whole file into memory
        for line in movie_ids_file:
            movie = json.loads(line)
            url = f'{MOVIE_ENDPOINT}/{movie["id"]}'
            urls.append({'url': url, 'popularity': movie['popularity']})


    print('sorting movies...')
    urls = sorted(urls, key=lambda movie: movie['popularity'], reverse=True)[:MOVIES_TO_FETCH]

    all_movies = []

    print('preparing thread pool...')

    actors = {}

    with ThreadPoolExecutor(max_workers=30) as movie_executor:
        future_to_url = {movie_executor.submit(load_url, movie['url']): movie['url'] for movie in urls}
        movies_fetched = 0
        for future in as_completed(future_to_url):
            try:
                data = future.result()
                
                if 'porn' in data['title'].lower():
                    continue

                cast_url = f'{MOVIE_ENDPOINT}/{data["id"]}/credits'
                actors[data['id']] = cast_url

                movies_fetched += 1

                data['cast'] = actors

                data['poster'] = f'{BASE_URL}/w200/{data["poster_path"]}'
                data['genres'] = [i['name'] for i in data['genres']]
                data['year'] = data['release_date'].split('-')[0]
                del data['adult']
                all_movies.append(data)
                if movies_fetched % 10 == 0:
                    print(f'{movies_fetched} movies fetched')
            except Exception as e:
                print(e)
                continue

    print('preparing thread pool for actors...')

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
                    print(f'{cast_counter} pieces of cast info fetched')
            except Exception as e:
                print(e)
                continue

    print('writing movies to json file...')
    with open(f'result_{MOVIES_TO_FETCH}.json', 'w') as result_file:
        json.dump(all_movies, result_file)

if __name__ == "__main__":
    get_all_movies()

