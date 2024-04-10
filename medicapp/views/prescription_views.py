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


# Doctor Prescription
@ api_view(['POST'])
@ permission_classes([AuthenticatedOnly])
def doctor_prescription(request, appointmentId):

    # +++++++++++++++++ get data from user +++++++++++++++++
    data = request.data

    # +++++++++++++++++ get user info +++++++++++++++++
    user = request.user

    try:
        # +++++++++++++++++ get appointment details matching to the appointment id in url +++++++++++++++++
        appointmentData = db["appointment"].find_one(
            {'_id': ObjectId(appointmentId)})
        print('appointmentData: ', appointmentData)

        # +++++++++++++++++ prescription data to be added +++++++++++++++++
        prescription = {
            # "appointentId": appointmentData['appointentId'],
            "medicineName": data["medicineName"],
            "drugForm": data["drugForm"],
            "doseQuantity": data["doseQuantity"],
            "doseUnit": data["doseUnit"],
            "doseDuration": data["doseDuration"],
            "doseFrequency": data["doseFrequency"],
            "doseDurationUnit": data["doseDurationUnit"],
            "createdAt": datetime.now().strftime("%d-%m-%Y, %I:%M%p"),
            "beDeleted": 0
        }

        # +++++++++++++++++ update existing appointment by adding prescription details +++++++++++++++++
        updateAppointment = db["appointment"].update_one(
            {"_id": ObjectId(appointmentId)}, {"$set": {"prescription": prescription}})

        # +++++++++++++++++ add new prescription data to the prescription table +++++++++++++++++
        newPrescription = db["prescription"].insert_one(prescription)

        print('updateAppointment: ', updateAppointment)
        print('newPrescription: ', newPrescription)

        return Response({"detail": "Prescription added successfully"}, status=status.HTTP_200_OK)

    # +++++++++++++++++ error handling +++++++++++++++++
    except Exception as e:
        print(e)
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
