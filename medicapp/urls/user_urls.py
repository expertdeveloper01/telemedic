from django.urls import path
from medicapp.views import user_views as views

'''
@route "/users"
@description Prescription Urls
'''
urlpatterns = [
    path('login/', views.login, name='login'),
    path('profile', views.get_user_profile, name="users-profile"),
    path('activate/', views.activate, name='activate'),
    path('resendmail', views.resend_email, name='resendmail'),
    path('user/<str:pk>/', views.get_user, name='user'),
    path('update/profile', views.profile, name="update/profile"),
    path('resetpassword', views.reset_password, name='resetpassword'),
    path('verifyresetpassword', views.verify_reset_password,
         name='verifyresetpassword'),
]
