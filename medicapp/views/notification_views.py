from datetime import datetime
from django.dispatch import receiver
from consultapp.serializers import NotificationSerilizer
# from consultapp.views.consult_views import consult
from rest_framework.response import Response
from consultapp.models import Consult_table, Message_table, Notification_table
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


# Notification Function(to get notification on every event)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def notification(request):
    if request.method == "GET":

        # print('..req', request.user)
        # task = Notification_table.objects.all()
        task = Notification_table.objects.filter(receiver=request.user.id).order_by('-notification_id')
        serializer = NotificationSerilizer(task, many=True)
        return Response(serializer.data)


# create notification
def create_notification(sender, receiver, notification_type, notification):
    user = Notification_table.objects.create(

        sender=sender,
        receiver=receiver,
        notification_type=notification_type,
        notification=notification,


    )


# unread notifications
@api_view(['GET'])
def count_notification(request):

    notifications = Notification_table.objects.filter(
        receiver_id=request.user.id, unread_notification=1).count()
    return Response(notifications)


# Read Notification
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def read_notification(request, pk):
    print('..request.user.id', request.user.id)
    Notification_table.objects.filter(
        receiver=request.user.id, unread_notification=1).update(unread_notification=0)
    return Response({'success': True})