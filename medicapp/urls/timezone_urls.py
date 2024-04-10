from django.urls import path
from medicapp.views import timezone_views as views


'''
@route "/timezone"
@description Timezone Urls
'''
urlpatterns = [
    path('', views.timezone_view, name='timezone'),

]
