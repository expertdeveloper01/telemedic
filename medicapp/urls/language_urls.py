from django.urls import path
from consultapp.views import language_views as views


# Language Urls
urlpatterns = [
    path('language', views.languageview, name='language'),

]