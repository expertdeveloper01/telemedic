from traceback import print_tb
from rest_framework.exceptions import ValidationError
from mongo_auth import messages
from mongo_auth.utils import create_unique_object_id, pwd_context
import datetime
from django.conf import settings
from django.db import IntegrityError
from medicapp.tokens import account_activation_token, reset_password_token
from rest_framework.permissions import IsAuthenticated
from mongo_auth.permissions import AuthenticatedOnly
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from rest_framework.decorators import api_view, permission_classes
from utils import db, parse_json
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from bson import ObjectId
import jwt
from mongo_auth.db import database, auth_collection, fields, jwt_life, jwt_secret, secondary_username_field


# Login view
@ api_view(['POST'])
def login(request):
    try:
        # ++++++++++++++ Get data from user ++++++++++++++
        data = request.data
        username = data['email']
        password = data['password']
        userType = data['userType']

        if "@" in username:
            user = database[auth_collection].find_one(
                {"email": username}, {"_id": 0})
        else:
            if secondary_username_field:
                user = database[auth_collection].find_one(
                    {secondary_username_field: username}, {"_id": 0})
            else:
                return Response({'message': 'Invalid Email and Password'}, status=status.HTTP_403_FORBIDDEN)

        # ++++++++++++++ Invalid UserType ++++++++++++++
        if not (userType == 'doctor' or userType == 'patient'):
            return Response({'message': 'Invalid Email and Password'}, status=status.HTTP_400_BAD_REQUEST)

        # ++++++++++++++ variables for data validation ++++++++++++++
        passwordToBeValidated = user["password"]
        isAccountActivated = user["userStatus"]
        isUserDeleted = user["beDeleted"]

        # ++++++++++++++ If user is deleted, ask user to contact the admin ++++++++++++++
        if isUserDeleted == 1:
            return Response({'message': 'Your account has been deactivated by admin. Please contact the admin to activate your account', "status": "Deactivate"},
                            status=status.HTTP_400_BAD_REQUEST)

        # ++++++++++++++ If user has not activated the account ask user to activate the account first before logging in ++++++++++++++
        if isAccountActivated == "Activation Pending":
            return Response({'message': 'Please activate your account before logging in', "status": "Activation Pending"},
                            status=status.HTTP_400_BAD_REQUEST)

        # ++++++++++++++ Wrong password ++++++++++++++
        if isAccountActivated == "Activate":
            isPassword = check_password(password, passwordToBeValidated)
            if not isPassword:
                return Response({'message': "Wrong Password. Please try again."}, status=status.HTTP_400_BAD_REQUEST)

        # ++++++++++++++ If data is valid, login success ++++++++++++++
        token = jwt.encode({'id': user['id'],
                            'exp': datetime.datetime.now() + datetime.timedelta(
            days=jwt_life)},
            jwt_secret, algorithm='HS256')
        print('..token', token)

        user = list(db['users'].aggregate([
            {
                "$lookup": {
                    "from": "timezone",
                    "localField": "timeZone",
                    "foreignField": "_id",
                    "as": "timezoneData"
                }
            },
            {"$match": {"email": username}}
        ]))
        print('userInfo', user[0])
        userInfo = user[0]
        data = {"token": token}
        # data = list({"token": token})
        data.update(userInfo)
        # data = {'timezone': user}
        # data.update(user)
        return Response(status=status.HTTP_200_OK,
                        data=parse_json(data))

    # ++++++++++++++ except conditions for error handling ++++++++++++++
    except ValidationError as v_error:
        return Response(status=status.HTTP_400_BAD_REQUEST,
                        data={'success': False, 'message': str(v_error)})

    # ++++++++++++++except conditions for error handling ++++++++++++++
    except Exception as e:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        data={"data": {"error_msg": str(e)}})


# Resend View
@api_view(['POST'])
def resend_email(request):
    # ++++++++++++++ Get data from user ++++++++++++++
    data = request.data
    # user = request.user

    email = data['email']

    # # ++++++++++++++ Initializing variables for validation ++++++++++++++
    dataToBeValidated = database[auth_collection].find_one({'email': email})

    # # ++++++++++++++ Invalid Email ++++++++++++++
    if not dataToBeValidated:
        return Response({'message': 'Please check your email and try again.'}, status=status.HTTP_400_BAD_REQUEST)

    res = {k: v for k, v in dataToBeValidated.items() if k not in [
        "_id", "password"]}

    print('response', res)

    # ++++++++++++++ Get uid for email verification ++++++++++++++
    resendEmailToken = jwt.encode({'id': res['id'], 'tokenType': 'resendEmailToken',
                                   'exp': datetime.datetime.now() + datetime.timedelta(
        minutes=10)},
        jwt_secret, algorithm='HS256')

    data = {'uid': resendEmailToken}
    print('..here2', data)

    # # ++++++++++++++ Subject for email to be sent ++++++++++++++
    subject = 'Activation mail - Telemedic'

    # # ++++++++++++++ Message for email to be sent ++++++++++++++
    message = f'<h2 style="text-align:center; background-color:grey;color:white">Telemedic</h2><br/>Hi <b>' + dataToBeValidated["firstName"] + '</b>,<br /><br /><i>Thank you</i> for registering your account at <i style="color:orange">Telemedic</i>.<br /><br />Please click on the following link to activate your account : <br /> <a href="https://192.168.1.190:8000/verified?user=' + dataToBeValidated["userType"] + "&uid=" + data.get(
        'uid') + '">https://192.168.1.190:8000/verified?user=' + dataToBeValidated["userType"] + "&uid=" + data.get('uid') + '</a><br /><br /><br /><span style="color:grey">Thank You for using Telemedic. Keeping you well.</span>'
    # message = f'<h2 style="text-align:center; background-color:grey;color:white">Telemedic</h2><br/>Hi <b>' + dataToBeValidated["firstName"] + '</b>,<br /><br /><i>Thank you</i> for registering your account at <i style="color:orange">Telemedic</i>.<br /><br />Please click on the following link to activate your account : <br /> <a href="http://localhost:3000/verified?user=' + dataToBeValidated["userType"] + "&uid=" + data.get('uid') + '">http://localhost:3000/verified?user=' + dataToBeValidated["userType"] + "&uid=" + data.get('uid') + '</a><br /><br /><br /><span style="color:grey">Thank You for using Telemedic. Keeping you well.</span>'

    # # ++++++++++++++ Email from ++++++++++++++
    email_from = settings.EMAIL_HOST_USER

    # # ++++++++++++++ Email to user email ++++++++++++++
    recipient_list = [email]

    # # ++++++++++++++ Send mail function ++++++++++++++
    send_mail(subject, message='', from_email=email_from,
              recipient_list=recipient_list, html_message=message)

    return Response({"message": "An email has been sent to your registered email address"})


# Resetpassword view
@ api_view(['POST'])
def reset_password(request):
    # ++++++++++++++ Get data from user ++++++++++++++
    data = request.data

    email = data['email']

    # ++++++++++++++ Initializing variables for validation ++++++++++++++
    dataToBeValidated = database[auth_collection].find_one({'email': email})
    print('dataToBeValidated', dataToBeValidated)

    # ++++++++++++++ Invalid Email ++++++++++++++
    if not dataToBeValidated:
        return Response({'message': 'This email is not registered with us!'}, status=status.HTTP_400_BAD_REQUEST)

    res = {k: v for k, v in dataToBeValidated.items() if k not in [
        "_id", "password"]}

    print('response', res)

    # ++++++++++++++ Get uid for email verification ++++++++++++++
    resetPasswordToken = jwt.encode({'id': res['id'], 'tokenType': 'resetPasswordToken',
                                     'exp': datetime.datetime.now() + datetime.timedelta(
        minutes=10)},
        jwt_secret, algorithm='HS256')

    data = {'uid': resetPasswordToken}
    print('..here2', data)

    # ++++++++++++++ Subject for email to be sent ++++++++++++++
    subject = 'Reset Password - Telemedic'

    # # ++++++++++++++ Message for email to be sent ++++++++++++++
    message = f'<h2 style="text-align:center; background-color:grey;color:white">Telemedic</h2><br/>Hi <b>' + dataToBeValidated["firstName"] + ', Click on the <i>link</i> to reset your password : <br /> <a href="https://192.168.1.190:8000/forgotpasswordconfirm?user=' + dataToBeValidated["userType"] + "?uid=" + data.get(
        'uid') + '">https://192.168.1.190:8000/forgotpasswordconfirm?user=' + dataToBeValidated["userType"] + "?uid=" + data.get('uid') + '</a><br /><br /><br /><span style="color:grey">Thank You for using Telemedic. Keeping you well.</span>'
    # message = f'<h2 style="text-align:center; background-color:grey;color:white">Telemedic</h2><br/>Hi <b>' + dataToBeValidated["firstName"] + '</b>,<br /><br /> Click on the <i>link</i> to reset your password : <br /> <a href="http://localhost:3000/forgotpasswordconfirm?user=' + dataToBeValidated["userType"] + "&uid=" + data.get('uid') + '">http://localhost:3000/forgotpasswordconfirm?user=' + dataToBeValidated["userType"] + "&uid=" + data.get('uid') + '</a><br /><br /><br /><span style="color:grey">Thank You for using Telemedic. Keeping you well.</span>'

    # # ++++++++++++++ Email from ++++++++++++++
    email_from = settings.EMAIL_HOST_USER

    # # ++++++++++++++ Email to user email ++++++++++++++
    recipient_list = [email]

    # # ++++++++++++++ Send mail function ++++++++++++++
    send_mail(subject, message='', from_email=email_from,
              recipient_list=recipient_list, html_message=message)

    return Response({'message': 'A password reset mail has been sent to your registered email address!'})


# Reset_confirm Password view
@ api_view(['POST'])
def verify_reset_password(request):
    print('demo.....')
    # ++++++++++++++ Get data from user ++++++++++++++
    data = request.data
    new_password = data['new_password']

    # ++++++++++++++ Get uid token ++++++++++++++
    uid = data['uid']

    try:
        # ++++++++++++++ Decode the token ++++++++++++++
        newId = jwt.decode(uid, jwt_secret, algorithms="HS256")

        print('newId:', newId['tokenType'])

        # ++++++++++++++ Find data with matching token ++++++++++++++
        dataToBeValidated = database[auth_collection].find_one(
            {'id': newId['id']})

        print('dataToBeValidated', dataToBeValidated)

        # ++++++++++++++ Invalid details ++++++++++++++
        if not dataToBeValidated:
            return Response('Invalid token or Activation link has expired!', status=status.HTTP_400_BAD_REQUEST)

        # ++++++++++++++ Update userStatus if there is a match ++++++++++++++
        if dataToBeValidated:
            database[auth_collection].update_one(
                {'id': newId['id']}, {"$set": {"password": make_password(new_password)}})
            return Response('Your password has been updated successfully. Now you can login to your account.')

        # ++++++++++++++ Else, display 'Activation link is invalid' ++++++++++++++
        else:
            return Response('Activation link is invalid!')

    # ++++++++++++++ if token has expired ++++++++++++++
    except jwt.ExpiredSignature:
        return Response('Invalid token or Activation link has expired!', status=status.HTTP_400_BAD_REQUEST)


# Email Link activation view
@ api_view(['POST'])
def activate(request):
    # ++++++++++++++ Get data from user ++++++++++++++
    data = request.data

    # ++++++++++++++ Get uid token ++++++++++++++
    uid = data['uid']

    # ++++++++++++++ Decode the token ++++++++++++++
    newId = jwt.decode(uid, jwt_secret, algorithms="HS256")
    print('newId:', newId['tokenType'])

    # ++++++++++++++ Find data with matching token ++++++++++++++
    dataToBeValidated = database[auth_collection].find_one(
        {'id': newId['id']})

    print('dataToBeValidated', dataToBeValidated)

    # ++++++++++++++ Update userStatus if there is a match ++++++++++++++
    if dataToBeValidated:
        database[auth_collection].update_one(
            {'id': newId['id']}, {"$set": {"userStatus": "Activate"}})
        return Response('Thank you for your email confirmation. Now you can login to your account.')

    # ++++++++++++++ Else, display 'Activation link is invalid' ++++++++++++++
    else:
        return Response('Activation link is invalid!')


# Get userProfile
@ api_view(['GET'])
@ permission_classes([AuthenticatedOnly])
def get_user_profile(request):
    user = request.user
    results = database[auth_collection].find_one(
        {"id": user['id']}, )
    return Response(parse_json(dict(results)))


@ api_view(['GET'])
@ permission_classes([AuthenticatedOnly])
def get_user(request, pk):
    user = request.user
    results = database[auth_collection].find_one(
        {"id": user['id']}, )
    return Response(parse_json(dict(results)))


# Update profile By User
@api_view(['PUT'])
@permission_classes([AuthenticatedOnly])
def profile(request):
    user = request.user
    instance = db["users"]
    data = request.data
    occupation = data.get('occupation', None)
    if data.get('userType') == 'doctor':
        occupation = None
    bloodGroup = data.get('bloodGroup', None)
    if data.get('userType') == 'doctor':
        bloodGroup = None
    treatmentArea = data.get('treatmentArea', None)
    if data.get('userType') == 'doctor':
        treatmentArea = list(map(lambda v: ObjectId(v), data['treatmentArea']))
    height = data.get('height', None)
    if data.get('userType') == 'doctor':
        height = None
    weight = data.get('weight', None)
    if data.get('userType') == 'doctor':
        weight = None
    speciality = data.get('speciality', None)
    if data.get('userType') == 'patient':
        speciality = None
    qualification = data.get('qualification', None)
    if data.get('userType') == 'patient':
        qualification = None
    license = data.get('license', None)
    if data.get('userType') == 'patient':
        license = request.data.get('file_name', None),
    if 'password' in data:
        all_object = {'password': make_password(data['password'])}
    else:
        all_object = {'firstName': data['firstName'], "lastName": data['lastName'], "email": data['email'], "phoneNumber": data['phoneNumber'], "dob": data['dob'], "gender": data['gender'], "state": data['state'], "city": data['city'], "zipCode": data['zipCode'],  "occupation": occupation, "bloodGroup": bloodGroup, "height": height, "weight": weight, "speciality": speciality, "qualification": qualification, "license": license,
                      "modifiedAt": datetime.datetime.now().strftime(
            "%d-%m-%Y, %I:%M%p"), "timeZone": ObjectId(data['timeZone']),
            "treatmentArea": treatmentArea,
        }
    instance.update_one(
        {"id": user['id']}, {'$set': all_object})
    results = database[auth_collection].find_one(
        {"id": user['id']}, )
    return Response(parse_json(results))
