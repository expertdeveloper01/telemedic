# chat/consumers.py
from email import message
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from consultapp.models import Message_table, Notification_table
from consultapp.serializers import Message_serializer, NotificationSerilizer
from asgiref.sync import sync_to_async
from channels.generic.websocket import WebsocketConsumer

from consultapp.views.notification_views import notification

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
# save the message database

    @sync_to_async
    def serializer_valid(self, serializer):
        return serializer.is_valid()

    @sync_to_async
    def serializer_save(self, serializer):
        return serializer.save()

# For Chat message (Chat message)
    async def chat_message(self, event):
    # async def message_type(self, event):
        print("+++event", event)
        message = event['message']
        self.user = self.scope["user"]

        # print("user", self.user)

        # print('scope', self.scope['user'])

        await self.send(text_data=json.dumps({
            'message': message,
            # 'type': event.get('type', ''),
            'type': 'chat_message',

        }))

        # self.accept()

      # For Notification (type)  
    async def notification_type(self, event):
        print("----event notification_type", event)

        notification = event['notification']

        # Send notication to WebSocket
        await self.send(text_data=json.dumps({

            'notification': notification,
            'type': 'notification'

        }))

    # Receive message from WebSocket

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print('text_data_json', text_data_json)
        message = text_data_json['message']
        message_type = text_data_json['type']

        print("###type", message_type)

        print("***event", message)

        # Data save in database serializer
        if message_type == "chat_message":
            data = {
                "message_type": message['message_type'],
                "sender_id": message['sender_id'],
                "message": message['message'],
                "consult_id": message["consult_id"],
                "recipient_id": message['recipient_id'],
                "created_at": message['created_at'],
                "current_messageTime": message['created_at'],
            }

            serializer = Message_serializer(data=data)

            if await self.serializer_valid(serializer):

                await self.serializer_save(serializer)
            else:
                print('..not valid', serializer.errors)

            # print('..serial', serializer.data)
        #Notification 
        #         
        if message_type == "notification":
            data = {
                "notification_type": message['notification_type'],
                # "sender": message['sender'],
                # "notification": message['notification'],

                "receiver": message['receiver']
            }        
        # Send message to room group
        if message_type == 'chat_message':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    # 'type': message_type,
                    'type': 'chat_message',
                    'message': message
                }
            )
          # Send notification to room group
        elif message_type == "notification":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'notification_type',
                    'notification': message
                }
            )

    
