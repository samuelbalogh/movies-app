import json

LARGE_FILE = 'result_100000_B.json'


with open(LARGE_FILE, 'r') as large:
    large_dataset = json.load(large)


LARGE_FILE_LEN = len(large_dataset)

chunks = 8
counter = 0
chunk_number = 1
results = []
for movie in large_dataset:
    counter += 1
    results.append(movie)
    if counter == (LARGE_FILE_LEN // chunks) * chunk_number:
        small_file = f'result_100000_{chunk_number}.json'
        with open(small_file, 'w') as small_file:
            json.dump(results, small_file)
        results = []
        chunk_number += 1
