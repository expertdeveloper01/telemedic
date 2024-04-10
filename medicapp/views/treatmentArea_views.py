from rest_framework.response import Response
from rest_framework.decorators import api_view
from utils import db, parse_json


# Treatment area views
@ api_view(['GET'])
def treatment_area(request):
    # data = request.data
    treatment_data = db["treatmentarea"]
    results = treatment_data.find({})
    return Response(parse_json(list(results)))
