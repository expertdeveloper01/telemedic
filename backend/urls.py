from datetime import datetime
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView


from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils import db, parse_json

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('mongo_auth/', include('mongo_auth.urls')),
    path('users/', include('medicapp.urls.user_urls')),
    path('appointment/', include('medicapp.urls.appointment_urls')),
    path('timezone/', include('medicapp.urls.timezone_urls')),
    path('treatmentarea/', include('medicapp.urls.treatmentArea_urls')),
    path('payment/', include('medicapp.urls.payment_urls')),
    path('prescription/', include('medicapp.urls.prescription_urls')),
    path('attendant/', include('medicapp.urls.attendant_urls')),
    path('pharmacy/', include('medicapp.urls.pharmacy_urls')),
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html')),
]
