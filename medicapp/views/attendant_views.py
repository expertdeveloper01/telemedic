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


# Delete Pharmacy
@ api_view(['DELETE'])
@ permission_classes([AuthenticatedOnly])
def delete_attendant(request, attendantId):
    try:
        results = db["attendant"].delete_one(
            {"patientId": request.user['_id'], "_id": ObjectId(attendantId)})
        return Response({'message': 'Attendant Deleted'})
    except:
        return Response()


# Get Attendant
@ api_view(['GET'])
@ permission_classes([AuthenticatedOnly])
def get_attendant(request):
    try:
        results = db["attendant"].find_one(
            {"patientId": request.user['_id']})
        # print("getAttendant:", results)
        return Response(parse_json(results))
    except:
        return Response()
