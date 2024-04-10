from django.urls import path
from consultapp.views import age_views as views


# Age Group Urls
urlpatterns = [
    path('agegroup', views.agegroupview, name='age'),
]
