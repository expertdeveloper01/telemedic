from django.urls import path
from consultapp.views import consult_views as views


# Consult Urls
urlpatterns = [
    path("doctoraccept/<str:pk>/", views.doctoraccept, name='doctor-accept'),
    path("doctorwithdraw/<str:pk>/", views.doctorwithdraw, name='doctor-withdraw'),
    path('doctor/consultlist/', views.docConsultList, name='doc-consult-list'),
    path('patient/consultlist/', views.patConsultList, name='pat-consult-list'),
    path('consult/form', views.consult, name='consult-form'),
    path('patientwithdraw/<str:pk>/', views.patientwithdraw, name='consult-form'),
    path('messages/count', views.message_count, name='messages'),
    path('read_message/<str:pk>', views.read_message, name='read_message'),


]
