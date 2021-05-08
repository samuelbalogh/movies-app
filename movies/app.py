import json

from flask import Flask, jsonify, render_template


app = Flask(__name__)


DATASET = "movies.json"

def get_movies():
    with open(DATASET, 'r') as dataset:
        data = json.load(dataset)
    return data


def get_dramas():
    dramas = []
    for movie in get_movies():
        if 'Drama' in movie['genres']:
            dramas.append(movie)

    return dramas



def get_90s_movies():
    pass


def get_moives_after_date(date):
    pass


def get_movies_with_actor(actor_name):
    pass
 


@app.route("/")
def index():
    with open(DATASET, 'r') as dataset:
        data = json.load(dataset)
    return jsonify(data), 200



@app.route("/drama")
def dramas():
    movies = get_dramas()
    return render_template('base.html', movies=movies)



@app.route("/90s")
def movies_from_the_90s():
    pass



if __name__ == "__main__":
    app.run(debug=True)
