from flask import Flask, jsonify, make_response
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Apply CORS to all routes under /api/

@app.route('/api/users', methods=['GET'])  # Make sure the route is prefixed with /api/
def users():
    try:
        file_path = 'projectfiles/map_clsloc.txt'
        class_data = {}
        with open(file_path, 'r') as file:
            for line in file:
                parts = line.strip().split()
                number = int(parts[1])
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

        model_data_path = 'projectfiles/Alexnet.json'
        with open(model_data_path, 'r') as file:
            model_data = json.load(file)

        data = {
            'classData': class_data,
            'imageClassMapping': image_class_mapping,
            'modelData': model_data
        }

        response = make_response(jsonify(data))
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    except Exception as e:
        return jsonify({'error': 'Failed to load data', 'details': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
