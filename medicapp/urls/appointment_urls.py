from django.urls import path
from medicapp.views import appointment_views as views

'''
@route "/appointment"
@description Appointment Urls
'''
urlpatterns = [
    path('book_appointment/',
         views.create_appointment, name='create-appointment'),
    path('docappointment', views.doc_appointment_list,
         name='docappointment'),
    path('patappointment', views.pat_appointment_list,
         name='patappointment'),
    path('cancelAppointment/<str:appointmentId>',
         views.cancel_appointment, name='cancel-appointment'),
    path('incomplete/appointment', views.incomplete_appointment,
         name='incomplete/appointment'),
    path("doctoraccept/<str:ABRAHIM>/",
         views.doctor_accept, name='doctor-accept'),
]
