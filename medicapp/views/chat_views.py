from email import message
from mimetypes import read_mime_types
from operator import length_hint

from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from consultapp.models import Message_table, Consult_table
from consultapp.serializers import Message_serializer
from rest_framework.decorators import api_view, permission_classes


# Message View
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def messageDetails(request):
    if request.method == 'GET':
        task = Message_table.objects.filter(Q(sender_id=request.user.id) | Q(
            recipient_id=request.user.id), consult_id=request.GET.get("consult_id"))

        serializer = Message_serializer(task, many=True)
        consult = Consult_table.objects.get(
            consult_id=request.GET.get("consult_id"))
        doctor = {}
        if consult.accepted_doctor_id is not None:
            doctor = {'first_name': consult.accepted_doctor_id.first_name,
                      'last_name': consult.accepted_doctor_id.last_name,
                      'id': consult.accepted_doctor_id.id,
                      }

        patient = {'first_name': consult.first_name,
                   'last_name': consult.last_name,
                   'id': consult.patient_id.id,
                   }

        return Response({'chats': serializer.data, 'doctor': doctor, 'patient': patient})
    elif request.method == 'POST':
        # Send message type Format
        if request.data.get('file_name') is None:
            message = "text"
        else:
            message = "file"
        # Get consult_id From Consult_Table
        consult = Consult_table.objects.get(
            consult_id=request.data["consult_id"])
        if request.user.user_type == "Doctor":
            recipient_id = consult.patient_id.id
        else:
            recipient_id = consult.accepted_doctor_id.id

        data = {
            "message_type": message,
            "message": request.data['message'],
            "file_name": request.data.get('file_name', None),
            "consult_id": request.data["consult_id"],
            "sender_id": request.user.id,
            "recipient_id": recipient_id,

        }

        serializer = Message_serializer(data=data)
        if serializer.is_valid():
            print('..valid')
            serializer.save()
        else:
            print('..not valid', serializer.errors)
        return Response(serializer.data)
