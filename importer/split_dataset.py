import json

CUT_TO = 30000

LARGE_FILE = 'result_100000.json'


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
        small_file = f'result_{CUT_TO}_{chunk_number}.json'
        with open(small_file, 'w') as small_file:
            json.dump(results, small_file)
        results = []
        chunk_number += 1
