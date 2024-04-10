import collections
from datetime import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils import db, parse_json
from rest_framework.decorators import api_view, permission_classes
from mongo_auth.permissions import AuthenticatedOnly
from bson import ObjectId
from rest_framework import status
import stripe
from django.core.mail import send_mail


# Get pharmacy details
@ api_view(['GET'])
@ permission_classes([AuthenticatedOnly])
def get_pharmacy(request):
    try:
        results = db["pharmacy"].find(
            {"patient": request.user['_id']})
        # print("getPharmacy:", results)
        return Response(parse_json(list(results)))
    except:
        return Response()


# Delete Pharmacy
@ api_view(['DELETE'])
@ permission_classes([AuthenticatedOnly])
def delete_pharmacy(request, pharmacyId):
    try:
        results = db["pharmacy"].delete_one(
            {"patient": request.user['_id'], "_id": ObjectId(pharmacyId)})
        return Response({'message': 'Pharmacy Deleted'})
    except:
        return Response()
