from django.urls import path
from consultapp.views import chat_views as views

# Chat Urls
urlpatterns = [
    path('chat/', views.messageDetails, name='chat'),
    # path('read_message/<str:pk>', views.read_message, name='read_message'),


]
