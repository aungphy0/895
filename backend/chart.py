from flask import Flask, jsonify, make_response
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/users', methods=['GET'])
def users():
    try:
        file_path = 'projectfiles/map_clsloc.txt'
        class_data = {}
        with open(file_path, 'r') as file:
            for line in file:
                parts = line.strip().split()
                class_id = parts[0]  # The class ID
                name = ' '.join(parts[2:])  # Joining the rest as the class name
                class_data[class_id] = name  # Mapping class ID to class name

        directory = 'dataset'
        image_class_mapping = {}
        for filename in os.listdir(directory):
            if filename.endswith('.jpeg'):
                class_name, _ = filename.split('_')  # Assuming class_name is before '_'
                image_class_mapping[filename] = class_name

        tree_data_path = 'projectfiles/synset_relation_2012.json'
        with open(tree_data_path, 'r') as file:
            tree_data = json.load(file)

        model_data_path = 'projectfiles/Alexnet.json'
        with open(model_data_path, 'r') as file:
            model_data = json.load(file)

        predicted_classes = {}
        for i in range(len(model_data)):
            probabilities = model_data[i]['probabilities']
            max_index = probabilities.index(max(probabilities))
            # Assuming the index in probabilities corresponds directly to the serial number which is `index + 1`
            # Fetch the corresponding class ID by finding the key with the matching value in class_data
            predicted_class = [k for k, v in class_data.items() if v == str(max_index + 1)]
            predicted_classes[model_data[i]['name']] = predicted_class[0] if predicted_class else None

        data = {
            'classData': class_data,
            'imageClassMapping': image_class_mapping,
            'modelData': model_data,
            'predictedClasses': predicted_classes,
            'treeData': tree_data
        }

        response = make_response(jsonify(data))
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    except Exception as e:
        return jsonify({'error': 'Failed to load data', 'details': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
