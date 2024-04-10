from ast import dump
from dbm import dumb
from rest_framework.response import Response
from rest_framework.decorators import api_view
from utils import db, parse_json


# TimeZone Function
@api_view(['GET'])
def timezone_view(request):
    timezone_data = db["timezone"]
    results = timezone_data.find()
    return Response(parse_json(list(results)))
