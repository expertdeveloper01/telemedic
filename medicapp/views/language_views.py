
from consultapp.serializers import  Language_serializer
from rest_framework.response import Response
from consultapp.models import  Language_table
from rest_framework.decorators import api_view

# Language Function
@api_view(['GET'])
def languageview(request):
    if request.method == "GET":
        language = Language_table.objects.all()
        serializer = Language_serializer(language, many=True)
        return Response(serializer.data)
