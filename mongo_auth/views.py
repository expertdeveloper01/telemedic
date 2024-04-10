import json
from rest_framework.decorators import api_view
from mongo_auth.utils import create_unique_object_id, pwd_context
from mongo_auth.db import database, auth_collection, fields, jwt_life, jwt_secret, secondary_username_field
import jwt
import datetime
from mongo_auth import messages
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.contrib.auth.hashers import make_password, check_password
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from django.conf import settings
from medicapp.tokens import account_activation_token, reset_password_token
from django.core.mail import send_mail
from utils import db, parse_json


@api_view(["POST"])
def register(request):
    try:
        data = request.data if request.data is not None else {}
        signup_data = {"id": create_unique_object_id()}
        all_fields = set(fields + ("email", "password"))
        if secondary_username_field is not None:
            all_fields.add(secondary_username_field)
        for field in set(fields + ("email", "password")):
            if field in data:
                signup_data[field] = data[field]
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST,
                                data={"error_msg": field.title() + " does not exist."})

        signup_data["firstName"] = data["firstName"]
        signup_data["lastName"] = data["lastName"]
        signup_data["username"] = data['email']
        signup_data["email"] = data['email']
        signup_data["phoneNumber"] = data["phoneNumber"]
        signup_data["password"] = make_password(data["password"])
        signup_data["userType"] = data["userType"]
        signup_data["createdAt"] = datetime.datetime.now().strftime(
            "%d-%m-%Y, %I:%M%p")
        signup_data["userStatus"] = "Activation Pending"
        # signup_data["userStatus"] = "Activate"
        signup_data["beDeleted"] = 0

        if database[auth_collection].find_one({"email": signup_data['email']}) is None:
            if secondary_username_field:
                if database[auth_collection].find_one({secondary_username_field: signup_data[secondary_username_field]}) is None:
                    database[auth_collection].insert_one(signup_data)
                    res = {k: v for k, v in signup_data.items() if k not in [
                        "_id", "password"]}
                    return Response(status=status.HTTP_200_OK,
                                    data={"data": res})
                else:
                    return Response({'detail': 'This email is already registered with us. Try using a different email'}, status=status.HTTP_400_BAD_REQUEST)

            else:
                # ++++++++++++++ Check if the phone number is available or not ++++++++++++++
                for r in db.users.find({"phoneNumber": data["phoneNumber"]}):
                    # print('response: ', r)
                    return Response({'detail': 'This phone number is already registered with us. Try using a different phone number'}, status=status.HTTP_400_BAD_REQUEST)

                database[auth_collection].insert_one(signup_data)
                res = {k: v for k, v in signup_data.items() if k not in [
                    "_id", "password"]}
                print('response', res)

                # ++++++++++++++ Get uid for email verification ++++++++++++++
                activationToken = jwt.encode({'id': res['id'], 'tokenType': 'activationToken',
                                              'exp': datetime.datetime.now() + datetime.timedelta(
                    minutes=10)},
                    jwt_secret, algorithm='HS256')

                data = {'uid': activationToken}
                print('..here2', data)

                # ++++++++++++++ Subject for email to be sent ++++++++++++++
                subject = 'Activation mail - Telemedic'

                # ++++++++++++++ Message for email to be sent ++++++++++++++
                # message = f'<h2 style="text-align:center; background-color:grey;color:white">Telemedic</h2><br/>Hi <b>' + signup_data["firstName"] + '</b>,<br /><br /><i>Thank you</i> for registering your account at <i style="color:orange">Telemedic</i>.<br /><br />Please click on the following link to activate your account : <br /> <a href="http://localhost:3000/verified?user=' + signup_data["userType"] + "&uid=" + data.get(
                #     'uid') + '">http://localhost:3000/verified?user=' + signup_data["userType"] + "&uid=" + data.get('uid') + '</a><br /><br /><br /><span style="color:grey">Thank You for using Telemedic. Keeping you well.</span>'
                message = f'<h2 style="text-align:center; background-color:grey;color:white">Telemedic</h2><br/>Hi <b>' + signup_data["firstName"] + '</b>,<br /><br /><i>Thank you</i> for registering your account at <i style="color:orange">Telemedic</i>.<br /><br />Please click on the following link to activate your account : <br /> <a href="https://192.168.1.190:8000/verified?user=' + signup_data["userType"] + "&uid=" + data.get(
                    'uid') + '">https://192.168.1.190:8000/verified?user=' + signup_data["userType"] + "&uid=" + data.get('uid') + '</a><br /><br /><br /><span style="color:grey">Thank You for using Telemedic. Keeping you well.</span>'

                # ++++++++++++++ Email from ++++++++++++++
                email_from = settings.EMAIL_HOST_USER

                # ++++++++++++++ Email to user email ++++++++++++++
                recipient_list = [signup_data["email"]]

                # ++++++++++++++ Send mail function ++++++++++++++
                send_mail(subject, message='', from_email=email_from,
                          recipient_list=recipient_list, html_message=message)
                return Response({'detail': 'You have been registered successfully. An account activation mail has been sent to your email'}, status=status.HTTP_200_OK)
                # return Response(status=status.HTTP_200_OK,
                #                 data={"data": res})
        else:
            return Response({'detail': 'This email is already registered with us. Try using a different email'}, status=status.HTTP_400_BAD_REQUEST)
    except ValidationError as v_error:
        return Response(status=status.HTTP_400_BAD_REQUEST,
                        data={'success': False, 'message': str(v_error)})
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        data={"data": {"error_msg": str(e)}})
