from consultapp.serializers import Agegroup_serializer
from rest_framework.response import Response
from consultapp.models import Age_group_table
from rest_framework.decorators import api_view


# Age Group Views
@api_view(['GET'])
def agegroupview(request):
    if request.method == "GET":
        age = Age_group_table.objects.all()
        serializer = Agegroup_serializer(age, many=True)
        return Response(serializer.data)
