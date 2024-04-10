from pymongo import MongoClient
from bson import json_util
import json


client = MongoClient('mongodb://192.168.1.190:27017')
db = client['telemedic']


def parse_json(data):
    return json.loads(json_util.dumps(data))
