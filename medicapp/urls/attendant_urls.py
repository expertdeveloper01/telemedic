from django.urls import path
from medicapp.views import attendant_views as views

'''
@route "/attendant"
@description Attendant Urls
'''
urlpatterns = [
    path('', views.get_attendant, name='get/attendant'),
    path("<str:attendantId>/",
         views.delete_attendant, name='delete-attendant'),

]
