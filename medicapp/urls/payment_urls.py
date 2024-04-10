from django.urls import path
from medicapp.views import payment_views as views


'''
@route "/payment"
@description Payment Urls
'''
urlpatterns = [
    path('getpayment', views.get_payment, name='payment'),
    path('addpayment', views.add_payment, name='add_payment'),
    path('deletecard/<str:stripeCustomerId>/',
         views.delete_card, name='delete_card'),

]
