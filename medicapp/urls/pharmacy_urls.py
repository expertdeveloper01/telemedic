from django.urls import path
from medicapp.views import pharmacy_views as views


'''
@route "/pharmacy"
@description Pharmacy Urls
'''
urlpatterns = [
    path('', views.get_pharmacy, name='get/pharmacy'),
    path("<str:pharmacyId>/",
         views.delete_pharmacy, name='delete-pharmacy'),
]
