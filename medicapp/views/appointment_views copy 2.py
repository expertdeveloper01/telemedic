import collections
from datetime import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils import db, parse_json
from rest_framework.decorators import api_view, permission_classes
from mongo_auth.permissions import AuthenticatedOnly
from bson import ObjectId
from rest_framework import status


# create appintment
@api_view(['POST'])
@permission_classes([AuthenticatedOnly])
def createAppointment(request):
    try:
        data = request.data
        collection_new_appointment = db["appointment"]

        if data['step'] == 0:
            appointment = {
                "patient": request.user['_id'],
                "createdAt":  datetime.now().strftime("%d-%m-%Y, %I:%M%p"),
                "firstName": data["firstName"],
                "lastName": data["lastName"],
                "email": data["email"],
                "phoneNumber": data["phoneNumber"],
                "gender": data["gender"],
                "timeZone": ObjectId(data['timeZone']),
                "height": data["height"],
                "weight": data["weight"],
                "dob": data['dob'],
                "bloodGroup": data['bloodGroup'],
                "treatmentArea": list(map(lambda v: ObjectId(v['_id']), data['treatmentArea'])),
                "appointmentDateTime": data["appointmentDateTime"],
                "medicalHistory": data.get('medicalHistory', None),
                "status": "incomplete",
                "step": 1
            }

            print('appointmentData: ', appointment)

            result = collection_new_appointment.insert_one(appointment)

            print('result: ', result)

            return Response({'message': 'appointment book successfully'})

        elif data['step'] == 1:
            appointment = {
                "pharmacy": ObjectId(data['_id']),
                "step": 2

            }

        elif data['step'] == 2:
            appointment = {
                "attendant": ObjectId(data['_id']),
                "step": 3,
                "status": "pending"

            }

        elif data['step'] == 3:
            appointment = {
                "attendant": ObjectId(data['_id']),
                "step": 4,
                "status": "pending"

            }

        # if '_id' in data:
        #     collection_new_appointment.update_one({
        #         '_id': ObjectId(data['_id'])
        #     }, {'$set': appointment})
        # else:
            # collection_new_appointment.insert_one(appointment)
        return Response({'message': 'hi'})
    except Exception as e:
        print(e)
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


# ++++ Doctor appointmentlist ++++++
@api_view(['GET'])
@permission_classes([AuthenticatedOnly])
def docAppointmentlist(request):
    data = request.user
    print(data)

    treatmentAreas = list(
        map(lambda obj: ObjectId(obj['_id']), data["treatmentArea"]))

    print('..treatmentArea', treatmentAreas)

    collection_appointment_list = db["appointment"]

    results = collection_appointment_list.aggregate([
        {
            "$lookup": {
                "from": "treatmentarea",
                "localField": "treatmentArea",
                "foreignField": "_id",
                "as": "treatmentArea"
            }
        },
        {
            "$unwind": "$treatmentArea"
        },
        {
            "$match": {
                "treatmentArea._id": {"$in": treatmentAreas}
            }
        }
    ])
    print(results)
    return Response(parse_json(list(results)))


# ++++ Patient appointmentlist ++++++
@ api_view(['GET'])
@ permission_classes([AuthenticatedOnly])
def patAppointmentlist(request):
    data = request.data
    user = request.user
    # print('<<uaer', user)

    collection_appointment_list = db["appointment"]

    results = collection_appointment_list.aggregate([
        {
            "$lookup": {
                "from": "timezone",
                "localField": "timeZone",
                "foreignField": "_id",
                "as": "timeZone"
            }
        },
        {"$match": {"patient": user["_id"]}},
        {"$sort": {"_id": -1}}
    ])
    print(results)

    return Response(parse_json(list(results)))


@ api_view(['POST'])
@ permission_classes([AuthenticatedOnly])
def orderPay(request, appointmentId):

    data = request.data
    user = request.user

    try:

        # +++++++++++++++++ get appointment details matching to the appointment id in url +++++++++++++++++
        appointmentData = db["appointment"].find_one(
            {'appointentId': appointmentId})

        print('appointmentData: ', appointmentData)

        orderPay = {
            "appointmentId": appointmentId,
            "userId": request.user['_id'],
            "transactionId": "",
            "transactionStatus": "Not paid",
            "chargeId": "",
            "customerToken": "",
            "totalAmount": "",
            "taxAmount": "",
            "paymentResponse": "",
            "cardType": "",
            "refundId": "",
            "refundAmount": "",
            "refundStatus": "",
            "refundDate": "",
            "createdAt":  datetime.now().strftime("%d-%m-%Y, %I:%M%p"),
        }

        results = db["payment"].insert_one(orderPay)
        # newPrescription = db["prescription"].insert_one(prescription)

        print(results)

        return Response(parse_json(list(results)))

    # +++++++++++++++++ error handling +++++++++++++++++
    except Exception as e:
        print(e)
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


# # Doctor Accept Appointment List
@ api_view(['PUT'])
@ permission_classes([AuthenticatedOnly])
def doctoraccept(request, ABRAHIM):
    # +++++++++++++++++ get data from user +++++++++++++++++
    data = request.data
    user = request.user
    print(data)

    # +++++++++++++++++ get user info +++++++++++++++++
    user = request.user

    updatedValue = None

    # +++++++++++++++++ value to be updated +++++++++++++++++
    if user["userType"] == 'doctor':
        updatedValue = "accepted"
    else:
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

    print('updatedValue: ', updatedValue)

    try:
        #     # +++++++++++++++++ get appointment details matching to the appointment id in url +++++++++++++++++
        appointmentData = db["appointment"].find(
            {'_id': ABRAHIM, })
        print('appointmentData: ', appointmentData)

        # ++++++++++++++ Update userStatus if token is activationToken and there is a match ++++++++++++++
        updatedData = db["appointment"].update_one(
            {'_id': ObjectId(user['_id'])}, {"$set": {"status": updatedValue}})
        print("updatedData", updatedData)
        if user["userType"] == 'doctor':
            return Response('appointment approved successfully')

    # +++++++++++++++++ error handling +++++++++++++++++
    except Exception as e:
        print(e)


@ api_view(['GET'])
@ permission_classes([AuthenticatedOnly])
def incompleteAppointment(request):
    pharmacy_list = db["appointment"]
    # results = pharmacy_list.find_one(
    #     {"$query": {"status": "incomplete"}, "$orderby": {"_id": -1}})
    results = pharmacy_list.aggregate([
        {
            "$lookup": {
                "from": "treatmentarea",
                "localField": "treatmentArea",
                "foreignField": "_id",
                "as": "treatmentArea"
            }
        },
        {"$match": {"status": "incomplete"}},
        {"$sort": {"_id": -1}},
        {"$limit": 1}
    ])
    record = results.next()
    print('result', record)
    return Response(parse_json(record))
    # return Response(parse_json(results))


@ api_view(['POST'])
@ permission_classes([AuthenticatedOnly])
def addPharmacy(request):
    try:
        # user = request.user
        # print('.....user', user)
        data = request.data
        collection_new_appointment = db["pharmacy"]
        add_pharmacy = {
            "patient": request.user['_id'],
            "createdAt":  datetime.now().strftime("%d-%m-%Y, %I:%M%p"),
            "pharmacyName": data["pharmacyName"],
            "pharmacyEmail": data["pharmacyEmail"],
            "pharmacyphoneNumber": data["pharmacyphoneNumber"],
            "state": data['state'],
            "city": data['city'],
            "zipCode": data['zipCode'],
            "status": "incomplete"
        }
        if '_id' in data:
            collection_new_appointment.update_one({
                '_id': ObjectId(data['_id'])
            }, {'$set': add_pharmacy})
        else:
            collection_new_appointment.insert_one(add_pharmacy)
        return Response({'message': 'Add pharmcy successfully'})
    except Exception as e:
        print(e)
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

# Get pharmacy details


@ api_view(['GET'])
@ permission_classes([AuthenticatedOnly])
def getPharmacy(request):
    pharmacy_list = db["pharmacy"]
    results = pharmacy_list.find_one(
        {"$query": {"status": "incomplete"}, "$orderby": {"_id": -1}})
    return Response(parse_json(results))


# Add attendant
@ api_view(['POST'])
@ permission_classes([AuthenticatedOnly])
def addAttendant(request):
    try:
        # user = request.user
        # print('.....user', user)
        data = request.data
        collection_new_appointment = db["attendant"]
        add_attendant = {
            "patient": request.user['_id'],
            "createdAt":  datetime.now().strftime("%d-%m-%Y, %I:%M%p"),
            "firstName": data["firstName"],
            "lastName": data["lastName"],
            "email": data["email"],
            "phoneNumber": data["phoneNumber"],
            "gender": data["gender"],
            "timeZone": ObjectId(data['timeZone']),
            "relation": data['relation'],
            "status": "incomplete"
        }
        if '_id' in data:
            collection_new_appointment.update_one({
                '_id': ObjectId(data['_id'])
            }, {'$set': add_attendant})
        else:
            collection_new_appointment.insert_one(add_attendant)
        return Response({'message': 'Add attendant successfully'})
    except Exception as e:
        print(e)
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


# Get Attendant
@ api_view(['GET'])
@ permission_classes([AuthenticatedOnly])
def get_attendant(request):
    user = request.user
    print('<<uaer', user)
    attendant_list = db["attendant"]
    results = attendant_list.find_one(
        {"$query": {"status": "incomplete"}, "$orderby": {"_id": -1}})
    print(results)
    return Response(parse_json(results))
# # Doctor Accept Appointment List


@ api_view(['PUT'])
@ permission_classes([AuthenticatedOnly])
def pendingAppointment(request):
    collection_new_appointment = db["appointment"]
    results = collection_new_appointment.aggregate([
        {"$match": {"status": "incomplete", "patient": request.user['_id']}},
        {"$limit": 1}
    ])
    collection_new_appointment.update_one({"patient": request.user['_id']}, {
                                          '$set': {"status": "pending"}})
    return Response()

# Doctor Prescription


@ api_view(['POST'])
@ permission_classes([AuthenticatedOnly])
def doctorPrescription(request, appointmentId):

    # +++++++++++++++++ get data from user +++++++++++++++++
    data = request.data

    # +++++++++++++++++ get user info +++++++++++++++++
    user = request.user

    try:
        # +++++++++++++++++ get appointment details matching to the appointment id in url +++++++++++++++++
        appointmentData = db["appointment"].find_one(
            {'appointentId': appointmentId})
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
            {"appointmentId": ObjectId(appointmentId)}, {"$set": prescription})

        # +++++++++++++++++ add new prescription data to the prescription table +++++++++++++++++
        newPrescription = db["prescription"].insert_one(prescription)

        print('updateAppointment: ', updateAppointment)
        print('newPrescription: ', newPrescription)

        return Response({"detail": "Prescription added successfully"}, status=status.HTTP_200_OK)

    # +++++++++++++++++ error handling +++++++++++++++++
    except Exception as e:
        print(e)
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


# Cancel Appointment View
@ api_view(['POST'])
@ permission_classes([AuthenticatedOnly])
def cancelAppointment(request, appointmentId):

    # +++++++++++++++++ get data from user +++++++++++++++++
    data = request.data

    # +++++++++++++++++ get user info +++++++++++++++++
    user = request.user

    reasonToCancel = data["reasonToCancel"]

    updatedValue = None

    # +++++++++++++++++ value to be updated +++++++++++++++++
    if user["userType"] == 'patient':
        updatedValue = "cancelledByPatient"

    elif user["userType"] == 'doctor':
        updatedValue = "cancelledByDoctor"

    else:
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

    print('updatedValue: ', updatedValue)

    try:
        # +++++++++++++++++ get appointment details matching to the appointment id in url +++++++++++++++++
        appointmentData = db["appointment"].find_one(
            # {'_id': ObjectId(data['_id']), })
            {'appointentId': ObjectId(appointmentId)})
        print('appointmentData: ', appointmentData)

        # ++++++++++++++ Update userStatus if token is activationToken and there is a match ++++++++++++++
        updatedData = db["appointment"].update_one(
            {'appointentId': appointmentId}, {"$set": {"status": updatedValue, "reasonToCancel": reasonToCancel}})
        print('updatedData: ', updatedData)

        # +++++++++++++++++ give response depending upon userType +++++++++++++++++
        if user["userType"] == 'patient':
            return Response('The appointment has been cancelled successfully. Your refund will start momentarily.')

        if user["userType"] == 'doctor':
            return Response('The appointment has been cancelled successfully.')

    # +++++++++++++++++ error handling +++++++++++++++++
    except Exception as e:
        print(e)
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
