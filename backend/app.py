##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################
# DON'T WORRY ABOUT THIS PART
import json
import random

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


FILES = [f'../importer/result_100000_{i}.json' for i in range(1, 4)]


def get_movies():
    results = []
    for file_ in FILES:
        with open(file_, 'r') as dataset:
            data = json.load(dataset)
            for movie in data:
                if len(movie['cast']) > 1000:
                    # delete in place
                    del movie['cast']
            results.extend(data)
    return results


ALL_MOVIES = get_movies()
print(f'Length of the whole movie dataset is {len(ALL_MOVIES)}...')
MOVIES = ALL_MOVIES[:10000]
print(f'Length of the smaller movie dataset is {len(MOVIES)}...')

##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################


def get_documentaries(movies):
    documentaries = []
    for movie in movies:
        if 'Documentary' in movie.get('genres', []):
            documentaries.append(movie)
    return documentaries


def get_dramas(movies):
    # TODO delete the body
    dramas = []
    for movie in movies:
        if 'Drama' in movie.get('genres', []):
            dramas.append(movie)
    return dramas


def get_scifis(movies):
    scifis = []
    for movie in movies:
        if 'Science Fiction' in movie.get('genres', []):
            scifis.append(movie)
    return scifis


def get_70s_movies(movies):
    # TODO delete the body
    results = []
    for movie in movies:
        if year := movie.get('year', 0):
            if 1980 > int(year) >= 1970:
                results.append(movie)
    return results


def get_80s_movies(movies):
    # TODO delete the body
    results = []
    for movie in movies:
        if year := movie.get('year', 0):
            if 1990 > int(year) >= 1980:
                results.append(movie)
    return results


def get_90s_movies(movies):
    # TODO delete the body
    results = []
    for movie in movies:
        if year := movie.get('year', 0):
            if 2000 > int(year) >= 1990:
                results.append(movie)
    return results


def search_movies(movies, search_term):
    # TODO delete body
    results = []
    term = search_term.lower()
    country_code = None
    if term.startswith('country:'):
        country_code = term.split(':')[1]
        for movie in movies:
            if len(country_data := movie['production_countries']) == 1:
                if country_data[0]['iso_3166_1'].lower() == country_code:
                    results.append(movie)
                    print(movie)
                    continue
    else:
        for movie in movies:
            if term in movie['title'].lower():
                results.append(movie)
            elif any([term in person.lower() for person in movie.get('cast', [])]):
                results.append(movie)
            elif term in [genre.lower() for genre in movie.get('genres', [])]:
                results.append(movie)
            elif term == str(movie.get('year')):
                results.append(movie)
            elif term in movie.get('original_title', '').lower():
                results.append(movie)
            elif term in [person.lower() for person in movie.get('crew', [])]:
                results.append(movie)
    return results


def get_new_movies(movies):
    results = []
    for movie in movies:
        if year := movie.get('year'):
            if int(year) > 2019:
                results.append(movie)
    return results


def get_most_popular_movies(movies):
    return sorted(movies, key=get_movie_popularity, reverse=True)


def get_unpopular_movies(movies):
    results = []
    for movie in sorted(movies, key=get_movie_popularity):
        if year := movie.get('year', 0):
            if int(year) < 2021:
                results.append(movie)
    return results


def get_movie_popularity(movie):
    return movie['vote_count']


def get_most_profitable_movies(movies):
    results = []
    for movie in movies:
        if movie['budget'] != 0:
            profit_ratio = movie['revenue'] / movie['budget']
            if profit_ratio > 10:
                results.append(movie)

    results = sorted(results, key=get_profit_ratio, reverse=True)[:100]
    return results


def get_highest_grossing_movies(movies):
    results = sorted(movies, key=get_revenue, reverse=True)
    return results


def get_worst_movies(movies):
    results = []
    for movie in sorted(movies, key=lambda movie: float(movie.get('vote_average', 10))):
        if int(movie.get('vote_count', 0)) < 120:
            continue
        if year := movie.get('year', 0):
            if int(year) < 2021:
                results.append(movie)
    return results

def get_revenue(movie):
    return movie['revenue']


def get_profit_ratio(movie):
    profit_ratio = 0
    if movie['budget']:
        profit_ratio = movie['revenue'] / movie['budget']
        if profit_ratio > 1000:
            # something wrong here! Probably the budget value is incorrect
            return 0
    return profit_ratio

def get_big_budget_movies(movies):
    results = sorted(movies, key=lambda movie: movie.get('budget', 0), reverse=True)[:200]
    return results


def get_random_movies(movies):
    movies_copy = movies.copy()
    random.shuffle(movies_copy)
    return movies_copy


def get_longest_movies(movies):
    result = sorted(movies, key=get_movie_length, reverse=True)[:10]
    return result


def get_movie_length(movie):
    runtime = 0
    if movie['runtime']:
        runtime = movie['runtime']

    return runtime


def get_french_movies(movies):
    return get_movies_from_country(movies, 'FR')


def get_movies_from_country(movies, country):
    results = []
    for movie in movies:
        if len(country_data := movie['production_countries']) == 1:
            if country_data[0]['iso_3166_1'] == country:
                results.append(movie)
    return results


##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################


def paginate(movies, sort=False):
    if sort:
        movies = sorted(movies, key=lambda movie: movie['vote_count'], reverse=True)
    offset = request.args.get('offset')

    if not offset:
        offset = 0
    offset = int(offset)

    limit = request.args.get('limit')
    if not limit:
        limit = 100
    limit = int(limit)

    return movies[offset: offset+limit]


@app.route("/")
@cross_origin()
def index():
    movies = MOVIES
    if (search_term := request.args.get('search')) is not None:
        movies = ALL_MOVIES
        movies = search_movies(movies, search_term)

    movies = paginate(movies)
    return jsonify(movies), 200


@app.route('/70s')
def seventies_movies():
    movies = get_70s_movies(MOVIES)
    movies = paginate(movies, sort=True)
    return jsonify(movies)


@app.route('/90s')
def nineties_movies():
    movies = get_90s_movies(MOVIES)
    movies = paginate(movies, sort=True)
    return jsonify(movies)


@app.route('/80s')
def eighties_movies():
    movies = get_80s_movies(MOVIES)
    movies = paginate(movies, sort=True)
    return jsonify(movies)


@app.route("/dramas")
def dramas():
    movies = get_dramas(MOVIES)
    movies = paginate(movies, sort=True)
    return jsonify(movies)


@app.route("/documentaries")
def documentaries():
    movies = get_documentaries(MOVIES)
    movies = paginate(movies, sort=True)
    return jsonify(movies)
    return jsonify(movies)


@app.route("/new")
def new():
    movies = get_new_movies(MOVIES)
    movies = paginate(movies)
    return jsonify(movies)


@app.route("/sci-fi")
def scifi():
    movies = get_scifis(MOVIES)
    movies = paginate(movies)
    return jsonify(movies)


@app.route("/popular")
def popular():
    movies = get_most_popular_movies(MOVIES)
    movies = paginate(movies, sort=False)
    return jsonify(movies)

@app.route("/profitable")
def profitable():
    movies = get_most_profitable_movies(MOVIES)
    movies = paginate(movies)
    return jsonify(movies)


@app.route("/grossing")
def grossing():
    movies = get_highest_grossing_movies(MOVIES)
    movies = paginate(movies)
    return jsonify(movies)


@app.route("/french")
def french():
    movies = get_french_movies(MOVIES)
    movies = paginate(movies, sort=True)
    return jsonify(movies)


@app.route("/random")
def random_movies():
    movies = get_random_movies(MOVIES)
    movies = paginate(movies)
    return jsonify(movies)


@app.route("/unpopular")
def unpopular_movies():
    movies = get_unpopular_movies(MOVIES)
    movies = paginate(movies)
    return jsonify(movies)


@app.route("/big-budget")
def big_budget():
    movies = get_big_budget_movies(MOVIES)
    movies = paginate(movies, sort=True)
    return jsonify(movies)

@app.route("/worst")
def worst():
    movies = get_worst_movies(MOVIES)
    movies = paginate(movies)
    return jsonify(movies)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
