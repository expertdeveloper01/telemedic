from django.urls import path
from medicapp.views import treatmentArea_views as views


'''
@route "/treatementarea"
@description Treatement Area Urls
'''
urlpatterns = [
    path('', views.treatment_area, name='treatmentarea'),

]
