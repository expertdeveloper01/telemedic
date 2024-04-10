from django.urls import path
from medicapp.views import prescription_views as views

'''
@route "/precription"
@description Prescription Urls
'''
urlpatterns = [
    path('<str:appointmentId>',
         views.doctor_prescription, name='doctor-prescription'),

]
