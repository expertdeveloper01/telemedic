from datetime import datetime
from django.conf import settings
from django.db import IntegrityError
from medicapp.tokens import account_activation_token, reset_password_token
from rest_framework.permissions import IsAuthenticated
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


# Get jwt tokens for user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# Register User view
@api_view(['POST'])
def register(request):
    # print('request:', user)

    # ++++++++++++++ Get data from user ++++++++++++++
    data = request.data
    # user = request.user

    try:
        # ++++++++++++++ Check if the db exists, if it already does not exist ++++++++++++++
        collection_new_user = db["users"]

        # ++++++++++++++ Variable for data to be saved in database ++++++++++++++
        newuser = {
            "id": collection_new_user.estimated_document_count() + 1,
            "_id": collection_new_user.estimated_document_count() + 1,
            "firstName": data["firstName"],
            "lastName": data["lastName"],
            "username": data['email'],
            "email": data['email'],
            "phoneNumber": data["phoneNumber"],
            "password": make_password(data["password"]),
            "userType": data["userType"],
            "createdAt": datetime.now().strftime("%d-%m-%Y, %I:%M%p"),
            # "userStatus": "Activation Pending",
            "userStatus": "Activate",
            # 'refresh': get_tokens_for_user(user),
            "beDeleted": 0
        }

        # ++++++++++++++ Check if the email is available or not ++++++++++++++
        for r in db.users.find({"email": newuser["email"]}):
            return Response({'detail': 'This email is already registered with us. Try using another email'}, status=status.HTTP_400_BAD_REQUEST)

        # ++++++++++++++ Check if the phone number is available or not ++++++++++++++
        for r in db.users.find({"phoneNumber": data["phoneNumber"]}):
            return Response({'detail': 'This phone number is already registered with us. Try using another phone number'}, status=status.HTTP_400_BAD_REQUEST)

        # ++++++++++++++ Data valid, save to database ++++++++++++++
        newuserObj = collection_new_user.insert_one(newuser)

        # newuser['id'] = newuser['_id']
        refresh = get_tokens_for_user(newuser)
        print('re', refresh)
        update_data = collection_new_user.update_one(
            {"email": newuser["email"]}, {'$set': {'refresh': refresh}}, {'upsert': True})

        results = collection_new_user.find({"email": newuser["email"]})

        # ++++++++++++++ Get uid and token for email verification ++++++++++++++
        # data = {'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        #         'token': account_activation_token.make_token(user)}

        # # ++++++++++++++ Subject for email to be sent ++++++++++++++
        # subject = 'Activation mail - Telemedic'

        # # ++++++++++++++ Message for email to be sent ++++++++++++++
        # message = f'<h2 style="text-align:center; background-color:grey;color:white">Telemedic</h2><br/>Hi <b>' + newuser["firstName"] + '</b>,<br /><br /><i>Thank you</i> for registering your account at <i style="color:orange">Telemedic</i>.<br /><br />Please click on the following link to activate your account : <br /> <a href="http://127.0.0.1:8000/verified?uid=' + data.get('uid') + '&token=' + data.get('token') + '">https://127.0.0.1:8000/verified?uid=' + data.get('uid') + "&token=" + data.get('token') + '</a><br /><br /><br /><span style="color:grey">Thank You for using Telemedic. Keeping you well.</span>'
        # message = f'<h2 style="text-align:center; background-color:#a86345;color:white">Telemedic</h2><br/>Hi <b>' + newuser["firstName"] + '</b>,<br /> <i>Thank you</i> for registering your account. Please click on the following link to activate your account : <br /> <a href="http://192.168.1.190:8000/verified?uid=' + data.get('uid') + '&token=' + data.get('token') + '">https://192.168.1.190:8000/verified?uid=' + data.get('uid') + "&token=" + data.get('token') + '</a>'

        # ++++++++++++++ Email from ++++++++++++++
        # email_from = settings.EMAIL_HOST_USER

        # # ++++++++++++++ Email to user email ++++++++++++++
        # recipient_list = [newuser["email"]]

        # # ++++++++++++++ Send mail function ++++++++++++++
        # send_mail(subject, message='', from_email=email_from,
        #           recipient_list=recipient_list, html_message=message)

        # return Response({'detail': 'You have been registered successfully. An account activation mail has been sent to your email'}, status=status.HTTP_200_OK)
        return Response({'message': parse_json(list(results))}, status=status.HTTP_200_OK)

    # ++++++++++++++ Exceptions for any error handling ++++++++++++++
    except IntegrityError as e:
        print(e)
        return Response({'detail': 'The email you entered is already registered'}, status=status.HTTP_400_BAD_REQUEST)
    except KeyError as e:
        message = {'detail': str(*e.args) + ' is required'}
        print(e)
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


# Login view
@ api_view(['POST'])
def login(request):
    # TODO: check for user status

    # ++++++++++++++ Get data from user ++++++++++++++
    data = request.data
    loginuser = {
        "username": data['username'],
        "password": data['password'],
        "userType": data["userType"],
    }

    # ++++++++++++++ Initializing variables for validation ++++++++++++++
    dataToBeValidated = db.users.find(
        {'username': loginuser['username'], 'userType': loginuser['userType']})

    # ++++++++++++++ Invalid Email ++++++++++++++
    if not dataToBeValidated:
        return Response({'message': 'Invalid Email and Password'}, status=status.HTTP_400_BAD_REQUEST)

    print('..data', loginuser["username"],
          loginuser["password"], loginuser["userType"])

    # ++++++++++++++ Initializing variables for validation ++++++++++++++
    passwordToBeValidated = ""
    isAccountActivated = ""
    isUserDeleted = ""

    for r in dataToBeValidated:
        passwordToBeValidated = r["password"]
        isAccountActivated = r["userStatus"]
        isUserDeleted = r["beDeleted"]

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
        isPassword = check_password(
            loginuser["password"], passwordToBeValidated)
        if not isPassword:
            return Response({'message': "Wrong Password. Please try again."}, status=status.HTTP_400_BAD_REQUEST)

        # ++++++++++++++ Successful login ++++++++++++++
        if isPassword:
            results = db["users"].find({"username": loginuser["username"]})
            return Response(parse_json(list(results)))

    return Response({'message': 'Invalid Email and Password'}, status=status.HTTP_400_BAD_REQUEST)


# Resend View
@api_view(['POST'])
def resendemail(request):
    # ++++++++++++++ Get data from user ++++++++++++++
    # print('request:', request.user)
    # token = request.token
    # print('token:', token)
    # print('request:', token)
    # data = request.data
    # user = request.user

    # email = data['email']

    # # ++++++++++++++ Initializing variables for validation ++++++++++++++
    # dataToBeValidated = db.users.find({'email': data['email']})

    # # ++++++++++++++ Invalid Email ++++++++++++++
    # if not dataToBeValidated:
    #     return Response({'message': 'Please check your email and try again.'}, status=status.HTTP_400_BAD_REQUEST)

    # data = {'uid': urlsafe_base64_encode(force_bytes(
    #     user.pk)), 'token': account_activation_token.make_token(user)}

    # # ++++++++++++++ Subject for email to be sent ++++++++++++++
    # subject = 'Activation mail - Telemedic'

    # # ++++++++++++++ Message for email to be sent ++++++++++++++
    # message = f'<h2 style="text-align:center; background-color:grey;color:white">Telemedic</h2><br/>Hi <b>' + data['email'] + '</b>, <i>Thank you</i> for registering. <br />Please click on the following link to activate your account : <br /><a href="http://127.0.0.1:8000/verified?uid=' + data.get('uid') + '&token=' + data.get('token') + '">http://127.0.0.1:8000/verified?uid=' + data.get('uid') + "&token=" + data.get('token') + '</a><br /><br /><br /><span style="color:grey">Thank You for using Telemedic. Keeping you well.</span>'
    # # message = f'<h2 style="text-align:center; background-color:grey;color:white">Telemedic</h2><br/>Hi <b>' + data['email'] + '</b>, <i>Thank you</i> for registering. <br />Please click on the following link to activate your account : <br /><a href="https://192.168.1.190:8000/verified?uid=' + data.get(
    # #     'uid') + '&token=' + data.get('token') + '">https://192.168.1.190:8000/verified?uid=' + data.get(
    # #     'uid') + "&token=" + data.get('token') + '</a><br /><br /><br /><span style="color:grey">Thank You for using Telemedic. Keeping you well.</span>'

    # # ++++++++++++++ Email from ++++++++++++++
    # email_from = settings.EMAIL_HOST_USER

    # # ++++++++++++++ Email to user email ++++++++++++++
    # recipient_list = [data['email']]

    # # ++++++++++++++ Send mail function ++++++++++++++
    # send_mail(subject, message='', from_email=email_from,
    #           recipient_list=recipient_list, html_message=message)

    return Response({"message": "An email has been sent to your registered email address"})


# # Resetpassword view
# @ api_view(['POST'])
# def resetpassword(request):
#     data = request.data
#     email = data['email']
#     user = CustomUser.objects.get(email=email)
#     print('..user', user.id)
#     if user is not None:
#         data = {'uid': urlsafe_base64_encode(force_bytes(user.id)),
#                 'token': reset_password_token.make_token(user)}
#         subject = 'Reset Password - Consult Medic'
#         message = f'<h2 style="text-align:center; background-color:#1976D2;color:white">Consult Medic</h2><br/>Hi <b>{user.email}</b>, Click on the <i>link</i> to reset your password : <br /> <a href="https://192.168.1.190:8000/password/reset/confirm?uid=' + data.get(
#             'uid') + '&token=' + data.get('token') + '">https://192.168.1.190:8000/password/reset/confirm?uid=' + data.get(
#             'uid') + "&token=" + data.get('token') + '</a>'
#         # message = f'Hi <b>{user.email}</b>, <i>your reset password</i> request. <a href="http://localhost:3000/password/reset/confirm?uid=' + data.get(
#         #     'uid') + '&token=' + data.get('token') + '">http://localhost:3000/password/reset/confirm?uid=' + data.get(
#         #     'uid') + "&token=" + data.get('token') + '</a>'
#         email_from = settings.EMAIL_HOST_USER
#         recipient_list = [user.email, ]
#         send_mail(subject, message='', from_email=email_from,
#                   recipient_list=recipient_list, html_message=message)
#         return Response({'message': 'A password reset mail has been sent to your registered email address!'})
#     else:
#         return Response({'message': 'This email is not registered with us!'}, status=status.HTTP_400_BAD_REQUEST)


# # Reset_confirm Password view
# @ api_view(['POST'])
# def verify_reset_password(request):
#     data = request.data
#     uid = data['uid']
#     token = data['token']
#     new_password = data['new_password']
#     try:
#         uid = force_text(urlsafe_base64_decode(uid))
#         user = CustomUser.objects.get(pk=uid)
#     except(TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
#         user = None
#     if user is None:
#         return Response('Invalid token!')
#     if not reset_password_token.check_token(user, token):
#         return Response('Activation link has expired!', status=status.HTTP_400_BAD_REQUEST)
#     else:
#         user.set_password(new_password)
#         user.save()
#         return Response('Your password has been updated successfully. Now you can login to your account.')


# Email Link activation view
@ api_view(['POST'])
def activate(request):
    data = request.data
    uid = data['uid']
    token = data['token']

    # ++++++++++++++ Initializing variables for validation ++++++++++++++
    # CHECK WITH DIFFERENT CONDITION
    dataToBeValidated = db.users.find({'email': data['email']})

    try:
        uid = force_text(urlsafe_base64_decode(uid))

    except(TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.user_status = 'Activate'
        user.save()
        return Response('Thank you for your email confirmation. Now you can login your account.')
    else:
        return Response('Activation link is invalid!')


# # Update profile By User
# @ api_view(['PUT'])
# @ permission_classes([IsAuthenticated])
# def profile(request):
#     user = request.user
#     serializer = CustomUserSerializer(user, many=False)

#     data = request.data

#     # dob = data.get('dob', None)
#     # if data.get('user_type') == 'Doctor':
#     #     dob = None

#     if data.get('password'):
#         user.set_password(data['password'])

#     else:
#         # basic Information

#         user.firstName = data['first_name']
#         user.lastName = data['lastName']
#         user.email = data['email']
#         user.phoneNumber = data['phoneNumber']
#         user.gender = data['gender']
#         user.dob = data['dob']

#         # Contact infromation

#         user.country = data['country']
#         user.state = data['state']
#         user.city = data['city']
#         user.zipcode = data['zipcode']
#         user.ustime_zone_id = data['ustime_zone']

#         # Other information (Patient)

#         user.occupation = data['occupation']
#         user.bloodGroup = data['bloodGroup']
#         user.height = data['height']
#         user.weight = data['weight']

#         # Other information (Doctor)

#         user.speciality = data['expertise']
#         user.qualification = data['qualification']
#         user.license = data['license']

#         # Modified profile date & time
#         user.modified_at = datetime.now()

#         # user.age.set(data['age'])
#         # user.languages.set(data['languages'])

#     user.save()
#     serializer = UserSerializerWithToken(user, many=False)
#     return Response(serializer.data)


# Get UserDetails By Id
# @ api_view(['GET'])
#
# def getUserById(request, pk):
#     user = CustomUser.objects.get(id=pk)
#     serializer = CustomUserSerializer(user, many=False)
#     return Response(serializer.data)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getUserById(request, pk):
    data = request.data

    user = db["users"]
    results = user.find({"_id": pk})
    return Response(parse_json(list(results)))

# # Get userProfile
# @ api_view(['GET'])
# @ permission_classes([IsAuthenticated])
# def getUserProfile(request):
#     user = request.user
#     serializer = CustomUserSerializer(user, many=False)
#     return Response(serializer.data)
