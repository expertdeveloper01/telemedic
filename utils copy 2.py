from pymongo import MongoClient
from bson.json_util import loads, JSONOptions
from bson import ObjectId
import json
client = MongoClient('mongodb://192.168.1.190:27017')
db = client['telemedic']
options = JSONOptions()  # options is a copy of DEFAULT_JSON_OPTIONS


def my_handler(x):
    if isinstance(x, ObjectId):
        return str(x)
    else:
        raise TypeError(x)


def parse_json(data):
    return loads(json.dumps(data, default=my_handler))
