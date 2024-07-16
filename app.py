from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB 연결
client = MongoClient('mongodb://localhost:27017/')
db = client['Introduce_team']
guestbook_collection = db['entries']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/guestbook', methods=['GET'])
def get_entries():
    entries = list(guestbook_collection.find())
    for entry in entries:
        entry['_id'] = str(entry['_id'])  # ObjectId를 문자열로 변환
    return jsonify(entries)

@app.route('/guestbook', methods=['POST'])
def add_entry():
    new_entry = {
        'name': request.json['name'],
        'message': request.json['message'],
        'date': datetime.now()
    }
    result = guestbook_collection.insert_one(new_entry)
    new_entry['_id'] = str(result.inserted_id)
    return jsonify(new_entry), 201

@app.route('/guestbook/<entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    try:
        result = guestbook_collection.delete_one({'_id': ObjectId(entry_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Entry not found"}), 404
        return jsonify({"message": "Entry deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)