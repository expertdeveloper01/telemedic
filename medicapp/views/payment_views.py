import collections
from rest_framework.decorators import api_view, permission_classes
import stripe
from rest_framework.decorators import api_view, permission_classes
from mongo_auth.permissions import AuthenticatedOnly
from rest_framework import status
from rest_framework.response import Response
from django.conf import settings
from utils import db, parse_json
from mongo_auth.db import database, auth_collection

stripe.api_key = "sk_test_51K51urSA1vcwncjwUUifLQ0e4BnSVaLq4yU6Kwjk1kLjOM4pAar7SPMYhnfMyU0qo1ORilSYdJhFzDYPmg93mf8o00ChMwdL0O"

# get payment


@api_view(['GET'])
@permission_classes([AuthenticatedOnly])
def get_payment(request):
    data = request.user

    if 'stripeCustomerId' in data:
        payment = stripe.Customer.list_payment_methods(
            data['stripeCustomerId'], type="card")

        return Response({'paymentMethods': payment['data']})
    return Response({'paymentMethods': []})


# update payment
@api_view(['PUT'])
@permission_classes([AuthenticatedOnly])
def add_payment(request):

    data = request.data
    user = request.user

    result = stripe.Customer.create(source=data['tokenId'], email=data['user']['email'],
                                    description='Customer for ' + data['user']['email'], name=data['user']['fullName'])

    database[auth_collection].update_one(
        {'_id': request.user['_id']}, {"$set": {"stripeCustomerId": result['id']}})

    return Response({'added': True, 'customerId': result['id']})


# Delete card
@ api_view(['PUT'])
@ permission_classes([AuthenticatedOnly])
def delete_card(request, stripeCustomerId):

    data = request.data
    user = request.user

    database[auth_collection].update_one(
        {'stripeCustomerId': stripeCustomerId}, {"$set": {"stripeCustomerId": None}})
    return Response({'message': 'Card Deleted'})


# # create invoice
# @ api_view(['PUT'])
# @ permission_classes([AuthenticatedOnly])
# def create_invoice(request):

#     data = request.data
#     user = request.user

#     result = stripe.Invoice.create(email=data['user']['email'],
#                                    description='Customer for ' + data['user']['email'], name=data['user']['fullName'], amount=data['500'])

#     database[auth_collection].update_one(
#         {'_id': request.user['_id']}, {"$set": {"amount": result['id']}})

#     return Response({'added': True, 'customerId': result['id']})
