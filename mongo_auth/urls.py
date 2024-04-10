# mongo_auth/urls.py
from mongo_auth import views
from django.urls import path

urlpatterns = [
    path('signup/', views.register, name="signup")
]
