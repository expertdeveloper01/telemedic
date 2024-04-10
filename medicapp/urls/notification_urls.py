from django.urls import path
from consultapp.views import notification_views as views

# Notifications url
urlpatterns = [
    path('notification/', views.notification, name='notification'),
    path('countnotification', views.count_notification, name='countnotification'),
    path('read_notification/<str:pk>',
         views.read_notification, name='read_notification'),
]