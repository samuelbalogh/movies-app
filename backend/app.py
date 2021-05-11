##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################
# DON'T WORRY ABOUT THIS PART

import json

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


DATASET = "../importer/result_100000.json"


def get_movies():
    with open(DATASET, 'r') as dataset:
        data = json.load(dataset)
    return data


MOVIES = get_movies()

##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################

def get_70s_movies(movies):
    results = []
    for movie in movies:
        year = movie['year']
        if year:
            if 1980 > int(year) >= 1970:
                results.append(movie)
    return results


def get_documentaries(movies):
    return []

def get_dramas(movies):
    return []


def get_scifis(movies):
    return []


def get_80s_movies(movies):
    return []


def get_90s_movies(movies):
    return []


def search_movies(movies, search_term):
    return []



def get_new_movies(movies):
    return []


def get_most_popular_movies(movies):
    return []


def get_movie_popularity(movie):
    return 0


def get_most_profitable_movies(movies):
    return []


def get_highest_grossing_movies(movies):
    return []


def get_revenue(movie):
    return 0


def get_profit_ratio(movie):
    return 0

def get_big_budget_movies(movies):
    pass


def get_longest_movies(movies):
    return []


def get_movie_length(movie):
    return 0


def get_french_movies(movies):
    return []


def get_movies_from_country(movies, country):
    return []


##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################
##############################################################################################################
# DONT WORRY ABOUT THE PARTS BELOW

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



if __name__ == "__main__":
    app.run(debug=True)
