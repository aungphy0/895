import os


file_path = 'projectfiles/map_clsloc.txt'

class_data = {}

with open(file_path, 'r') as file:
    for line in file:
        parts = line.strip().split()
        number = int(parts[1])  
        # Store data in the dictionary with number as the key
        class_data[number] = {
            'class_id': parts[0],
            'name': ' '.join(parts[2:])
        }


directory = 'dataset'

image_class_mapping = {}

for filename in os.listdir(directory):
    if filename.endswith('.jpeg'):
        class_name = filename.split('_')[0]
        image_class_mapping[filename] = class_name

print(image_class_mapping)
