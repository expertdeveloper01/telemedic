import uuid
import jwt
from passlib.context import CryptContext
from mongo_auth.db import jwt_secret, auth_collection
from mongo_auth.db import database


pwd_context = CryptContext(
    default="django_pbkdf2_sha256",
    schemes=["django_argon2", "django_bcrypt", "django_bcrypt_sha256",
             "django_pbkdf2_sha256", "django_pbkdf2_sha1",
             "django_disabled"])


def create_unique_object_id():
    unique_object_id = "ID_{uuid}".format(uuid=uuid.uuid4())
    return unique_object_id


# Check if user if already logged in
def login_status(request):
    token = request.META.get('HTTP_AUTHORIZATION')
    if(token):
        token = token.replace('Bearer ', '')

    try:
        data = jwt.decode(token, jwt_secret, algorithms=['HS256'])
    except Exception as e:
        print('..Exception', e)

    # print('..1data', data['id'])
    user_obj = None
    flag = False
    try:
        user_filter = database[auth_collection].count_documents(
            {"id": data["id"]})
    except Exception as e:
        print('..Exception in filter', e)
    # print('..2data')

    if user_filter:
        flag = True
        user_filter = database[auth_collection].find(
            {"id": data["id"]}, {"password": 0})
        user_obj = list(user_filter)[0]
    # print('..3data', user_filter, flag)

    return flag, user_obj
