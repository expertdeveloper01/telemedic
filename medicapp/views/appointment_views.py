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


@api_view(['POST'])
@permission_classes([AuthenticatedOnly])
def create_appointment(request):
    try:
        data = request.data
        collection_new_appointment = db["appointment"]
        print('request.data: ', data)
        if data['step'] == 0:
            appointment = {
                "patient": request.user['_id'],
                "createdAt":  datetime.utcnow().strftime("%Y-%d-%m %H:%M"),
                "firstName": data["firstName"],
                "lastName": data["lastName"],
                "email": data["email"],
                "phoneNumber": data["phoneNumber"],
                "gender": data["gender"],
                # "timeZone": ObjectId(data['timeZone']),
                "height": data["height"],
                "weight": data["weight"],
                "dob": data['dob'],
                "bloodGroup": data['bloodGroup'],
                "treatmentArea": list(map(lambda v: ObjectId(v['_id']), data['treatmentArea'])),
                "appointmentDateTime": data["appointmentDateTime"],
                "status": "incomplete",
                "acceptedDoctorId": None
            }

            appointmentId = None
            if 'appointmentId' in data:
                collection_new_appointment.update_one({
                    '_id': ObjectId(data['appointmentId'])
                }, {'$set': appointment})
                appointmentId = data['appointmentId']
                print('updatedappointment', appointmentId)

            else:
                insert_result = collection_new_appointment.insert_one(
                    appointment)
                appointmentId = insert_result.inserted_id
                print('insertedappointment', appointmentId)

            db['appointment'].update_one(
                {'_id': ObjectId(appointmentId)}, {'$set': {'step': 1}})

            dataToFind = db['appointment'].find_one(
                {'_id': ObjectId(appointmentId)})
            print('dataToFind', dataToFind)

            return Response({'message': 'Step1 successful', 'data': parse_json(dataToFind)})

        elif data['step'] == 1:

            for pharma in data['pharmacies']:
                print('pharmacies: ', parse_json(pharma))
                appointmentId = None
                pharma['patient'] = request.user['_id']

                # if 'pharmacyId' in pharma:
                if '_id' in pharma:
                    # Update
                    db["pharmacy"].update_one(
                        {"patientId": request.user['_id']}, {'$set': pharma})
                    appointmentId = data['appointmentId']
                    print('updatedPharma', appointmentId)
                else:
                    # insert
                    db["pharmacy"].insert_one(pharma)
                    appointmentId = data['appointmentId']
                    print('insertedPharma', appointmentId)

                db['appointment'].update_one(
                    {'_id': ObjectId(appointmentId)}, {'$set': {'step': 2}})

                dataToFind = db['appointment'].find_one(
                    {'_id': ObjectId(appointmentId)})
                print('dataToFind', parse_json(dataToFind))

            return Response({'message': 'Step2 successful', 'data': parse_json(dataToFind)})

        elif data['step'] == 2:

            attendant = {
                # "appointmentId": ObjectId(data['_id']),
                "firstName": data["firstName"],
                "lastName": data["lastName"],
                "email": data["email"],
                "phoneNumber": data["phoneNumber"],
                "patientId": request.user['_id'],
                "timeZone": ObjectId(data['timeZone']),
                "createdAt": datetime.now().strftime("%d-%m-%Y, %I:%M%p"),
                "relationWithPatient": data['relation'],
            }

            appointmentId = None
            if 'attendantId' in data:
                # Update
                db["attendant"].update_one(
                    {"patientId": request.user['_id']}, {'$set': attendant})
                appointmentId = data['appointmentId']

                print('UpdateAttendant', appointmentId)
            else:
                # insert
                db["attendant"].insert_one(attendant)
                appointmentId = data['appointmentId']
                print('insertAttendant', appointmentId)

            db['appointment'].update_one(
                {'_id': ObjectId(appointmentId)}, {'$set': {'step': 3}})

            dataToFind = db['appointment'].find_one(
                {'_id': ObjectId(appointmentId)})
            print('dataToFind', dataToFind)

            return Response({'message': 'Step 3 successful', 'data': parse_json(dataToFind)})

        elif data['step'] == 3:
            appointmentId = None

            appointmentId = data['appointmentId']

            db['appointment'].update_one(
                {'_id': ObjectId(appointmentId)}, {'$set': {"status": "pending"}})

            return Response({'message': 'Appointment Booking Successful'})

    except Exception as e:
        print(e)
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


# get incomplete appointments
@ api_view(['GET'])
@ permission_classes([AuthenticatedOnly])
def incomplete_appointment(request):
    appointment_list = db["appointment"]

    results = appointment_list.aggregate([
        {
            "$lookup": {
                "from": "treatmentarea",
                "localField": "treatmentArea",
                "foreignField": "_id",
                "as": "treatmentArea"
            }
        },
        {"$match": {"status": "incomplete", "patient": request.user['_id']}},
        {"$sort": {"_id": -1}},
        {"$limit": 1}
    ])
    results = list(results)
    if len(results) != 0:
        record = results[0]
        # print('results', record)
        return Response(parse_json(record))
    else:
        return Response()


# ++++ Doctor appointmentlist ++++++
@api_view(['GET'])
@permission_classes([AuthenticatedOnly])
def doc_appointment_list(request):
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
                "$or": [
                    {"status": "pending", "treatmentArea._id": {
                        "$in": treatmentAreas}},
                    {"acceptedDoctorId": request.user['_id']}
                ]
            },
        },
        {"$sort": {"_id": -1}}
    ])
    print(results)
    return Response(parse_json(list(results)))


# ++++ Patient appointmentlist ++++++
@ api_view(['GET'])
@ permission_classes([AuthenticatedOnly])
def pat_appointment_list(request):
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
                "as": "timezone"
            }
        },
        {"$match": {"patient": user["_id"]}},
        {"$sort": {"_id": -1}}
    ])
    print("timedata", results)
    return Response(parse_json(list(results)))


# # Doctor Accept Appointment List
@ api_view(['PUT'])
@ permission_classes([AuthenticatedOnly])
def doctor_accept(request, ABRAHIM):
    # +++++++++++++++++ get data from user +++++++++++++++++
    data = request.data
    user = request.user
    print("usrrrrr", user)
    email = user['email']
    print(data)

    # +++++++++++++++++ get user info +++++++++++++++++
    user = request.user

    updatedValue = None

    # +++++++++++++++++ value to be updated +++++++++++++++++
    if user["userType"] == 'doctor':
        updatedValue = "accepted"

        # amount=2000,
        # currency="usd",
        # source="tok_visa",
    # description="My First Test Charge (created for API docs)",
# )
    else:
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

    print('updatedValue: ', updatedValue)

    try:
        # result = db["users"].find_one({

        # })

        #     # +++++++++++++++++ get appointment details matching to the appointment id in url +++++++++++++++++
        appointmentData = db["appointment"].aggregate([
            {
                "$lookup": {
                    "from": "users",
                    "localField": "patient",
                    "foreignField": "_id",
                    "as": "patient"
                }
            },
            {"$match":  {'_id': ObjectId(ABRAHIM)}}
        ])
        # appointmentData = db["appointment"].find(
        #     {'_id': ABRAHIM, })
        appointmentData = list(appointmentData)[0]
        print('appointmentData: ', appointmentData)

        payments = stripe.Charge.create(
            customer=appointmentData['patient'][0]['stripeCustomerId'], amount='200000', currency='inr')
        print('....payment', payments)

        result = db["payment"].insert_one(
            {"appointmentId": appointmentData["_id"], "transactionId": payments['balance_transaction'],
                "totalAmount": payments['amount'], "transactionStatus": 'paid', "chargeId": payments['id'], "customerToken": payments['customer'], "createdAt": payments['created']},



        )
        print('...pyment result', result)
        # ++++++++++++++ Update userStatus if token is activationToken and there is a match ++++++++++++++
        updatedData = db["appointment"].update_one(
            {'_id': ObjectId(ABRAHIM)}, {"$set": {"status": updatedValue, "acceptedDoctorId": request.user['_id']}})
        print("updatedData", updatedData)
        # # ++++++++++++++ Subject for email to be sent ++++++++++++++
        subject = 'Appointment Confirmed - Tele Medic'

        # # ++++++++++++++ Message for email to be sent ++++++++++++++

        message = f'<h2 style="text-align:center; background-color:grey;color:white">Telemedic</h2><br/>Hi <b> ' + appointmentData['firstName'] + '</b>,<br /><br />Your appointment has been confirmed at <i>Tele Medic </i>& your appointment-fee has been debited from your payment account<br /><br /><b>Your appointment booking details are described below:</b><br/>Name: '+appointmentData[
            'firstName']+' <br />Email : '+appointmentData['email']+' <br />Preferred date & time : '+appointmentData['appointmentDateTime']+' <br />Status: Confirmed<br/><br/><h4>INVOICE</h4><div style=margin-top:7px;color:grey><i>Tele Medic<br/>invoiceno: 32</i></div><br/>Transaction Id: <br/>Total:2000.00rs <br/><br/><div style=margin-top:100px;color:grey><i>Thank You for using Tele Medic. We heal your soul</i></div>'
        print("emailmessage", message)
    #    message = f'<h2 style="text-align:center; background-color:grey;color:white">Telemedic</h2><br/>Hi <b>' + dataToBeValidated["firstName"] + ', Click on the <i>link</i> to reset your password : <br /> <a href="http://192.168.1.190:8000/forgotpasswordconfirm?user=' + dataToBeValidated["userType"] + "?uid=" + data.get('uid') + '">http://192.168.1.190:8000/forgotpasswordconfirm?user=' + dataToBeValidated["userType"] + "?uid=" + data.get('uid') + '</a><br /><br /><br /><span style="color:grey">Thank You for using Telemedic. Keeping you well.</span>'

        # # ++++++++++++++ Email from ++++++++++++++
        email_from = settings.EMAIL_HOST_USER
        print("email from", email_from)

        # # ++++++++++++++ Email to user email ++++++++++++++
        recipient_list = [appointmentData['patient'][0]['email']]
        print("recpnt lidst", recipient_list)

        # # ++++++++++++++ Send mail function ++++++++++++++
        send_mail(subject, message='', from_email=email_from,
                  recipient_list=recipient_list, html_message=message)

        if user["userType"] == 'doctor':
            return Response({'message': 'appointment approved successfully', 'data': payments})

    # +++++++++++++++++ error handling +++++++++++++++++
    except Exception as e:
        print(e)
        return Response("hjgkjgjhfhgf")


# Cancel Appointment View
@ api_view(['POST'])
@ permission_classes([AuthenticatedOnly])
def cancel_appointment(request, appointmentId):

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
            {'_id': ObjectId(appointmentId)})
        print('appointmentData: ', appointmentData)

        # ++++++++++++++ Update userStatus if token is activationToken and there is a match ++++++++++++++
        updatedData = db["appointment"].update_one(
            {'_id': ObjectId(appointmentId)}, {"$set": {"status": updatedValue, "reasonToCancel": reasonToCancel}})
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
