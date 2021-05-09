import json



with open('movies.json', 'r') as movies_file:
    first_set = json.load(movies_file)


with open('movies2.json', 'r') as movies_file:
    second_set = json.load(movies_file)



