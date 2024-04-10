from datetime import date

from django.db import connection
from consultapp.serializers import Appointment_serializer, ConsultTableSerializer, CustomUserSerializer, Message_serializer
from consultapp.models import Consult_table, CustomUser, Message_table, Appointment_table
from django.db.models import Q
from consultapp.views.notification_views import create_notification, notification
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import send_mail, BadHeaderError
from opentok import OpenTok
from opentok import MediaModes

# Consult Form Details


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def consult(request):
    try:
        data = request.data

        print('preff', data['preferred_time'])
        user = Consult_table.objects.create(

            patient_id=request.user,

            first_name=data['first_name'],

            last_name=data['last_name'],
            email=data['email'],
            phone_number=data['phone_number'],
            country=data['country'],
            state=data['state'],
            city=data['city'],
            dob=data['dob'],
            preferred_time=data['preferred_time']

        )

        create_notification(None, request.user, 'CONSULT_BOOK',
                            'Your consult has been booked successfully')

        user_data = CustomUserSerializer(request.user).data

        cursor = connection.cursor()
        cursor.execute(
            f'''select convert_tz('{user.preferred_time}','UTC','{user_data['ustime_zone_names']['abbrevation']}');''')

        row = cursor.fetchone()
        hr = row[0].hour
        min = row[0].minute
        if (hr > 12):
            ampm = "PM"
        else:
            ampm = "AM"
        if (hr % 12 == 0):
            hr = 12
        if (hr % 12 != 0):
            hr = hr % 12
        if hr < 10:
            hr = "0" + str(hr)

        if min < 10:
            min = "0" + str(min)

        twelvehr = str(hr) + " : " + str(min) + " " + str(ampm)

        # convert date to right format
        formatteddate = row[0].day
        formattedmonth = row[0].month

        if formatteddate < 10:
            formatteddate = "0" + str(formatteddate)

        if formattedmonth < 10:
            formattedmonth = "0" + str(formattedmonth)

        formatteddatemonth = str(
            formatteddate) + "-" + str(formattedmonth) + "-" + str(row[0].year)

        ########### Email sent to patient after consult confirmation ##########

        subject = 'Consult Booked Successfully - Consult Medic'
        message = f'<h2 style="text-align:center; background-color:#1976D2;color:white">Consult Medic</h2><br/>Hi <b>{user.first_name}</b>,<br /><br />Your consult has been booked successfully at <i>Consult Medic.</i><br /><br /><b>Your consult booking details are described below:</b><br/>Name:{user.first_name} {user.last_name}<br />Email: {user.email}<br />Preferred Time: {formatteddatemonth} at {twelvehr}<br />Status: <span style=color:grey>Waiting for a doctor to accept the consult</span><br /><br /><div style="color:red">A follow up mail will be sent once a doctor accepts the consult</div><div style=margin-top:100px;color:grey><i>Thank You for using Consult Medic. We heal your soul</i></div>'
        # message = render_to_string(
        #      'ConsultBookedToPatient.html', {'name': user.first_name,
        #                     'email': user.email,
        #                     })
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [user.email]

        print("user.patient_id.email", user.email)
        send_mail(subject, message='', from_email=email_from, html_message=message,
                  recipient_list=recipient_list)

        serializer = ConsultTableSerializer(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'detail': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

# Usertable Views


def calculate_age(born):
    if not born:
        return 0
    today = date.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))


# Consult Chat
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def docConsultList(request):
    # # Search by keyword
    query = request.query_params.get('keyword')
    if query == None:
        query = ''
    # sortBy and sortOrder
    sortBy = request.query_params.get('sortBy', 'consult_id')
    sortOrder = request.query_params.get('sortOrder', 'desc')
    if sortOrder != 'asc':
        sortBy = '-' + sortBy
    user = request.user
    ages = []
    for age in user.age.all():
        ages.extend(list(range(age.age_min, age.age_max + 1)))
    # print('total ages: ', ages)
    # Filter Data by Language & Age
    consults = Consult_table.objects.filter(
        Q(consult_status='Approved', accepted_doctor_id=None) | Q(
            accepted_doctor_id=user.id),
        patient_id__in=[q.id for q in CustomUser.objects.filter(languages__in=user.languages.all())]).filter(first_name__icontains=query).order_by(sortBy)
    # if request.user.user_type == "Patient":
    #     receiver = consults.accepted_doctor_id
    #     create_notification(request.user, receiver, 'Consult_Request',
    #                         'Consult Request')
    new_consults = []
    for consult in consults:
        if calculate_age(consult.dob) in ages:
            new_consults.append(consult)
            # print('new Consults: ', new_consults)
    # For Pagination
    page = request.query_params.get('page', 1)
    # Paginator in this case takes in new_consults we want to paginage, and number means how many should come up on one page
    paginator = Paginator(new_consults, 10)
    try:
        # if we pass in a page, 'paginator' and 'page' is defined above
        new_consults = paginator.page(page)
    except PageNotAnInteger:
        # when we have not clicked on a page, means we are on page 1
        new_consults = paginator.page(1)
    except EmptyPage:
        # If we have am empty page (meaning the page has no products)
        new_consults = paginator.page(paginator.num_pages)
    # If for some reason the frontend has some errors
    if page == None:
        page = 1
    # we want our page to always be an integer
    page = int(page)
    serializer = ConsultTableSerializer(new_consults, many=True)
    # Get unread messages for consult
    serialized_data = serializer.data
    for data in serialized_data:
        # print('data: ', data)
        # for i in data:
        #     print('data: ', data)
        #     # languages = {
        #     #     'languages': data['languages_names']
        #     # }
        unread_message_count = Message_table.objects.filter(
            consult_id=data['consult_id'], unread_message=1, recipient_id=request.user.id).count()
        data['unread_message_count'] = unread_message_count
    # return Response({'consults': serializer.data, 'page': page, 'languages': languages, 'pages': paginator.num_pages})
    return Response({'consults': serializer.data, 'page': page, 'pages': paginator.num_pages})
# Doctor Accept Consult List


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def doctoraccept(request, pk):
    data = request.data
    print(data, "accepted")
    # get consult
    consult = Consult_table.objects.get(
        consult_id=pk, consult_status="Approved")
    if request.user.user_type == "Doctor":
        print('..acc dctr', request.user)
        receiver = consult.patient_id
        print('pat', receiver)
        create_notification(request.user, receiver, 'CONSULT_ACCEPTED',
                            'Your consult id {} has been accepted by doctor'.format(consult.consult_id))
        print("#msg", create_notification)
    # if consult status is 'Approved' by admin
    if consult.consult_status == 'Approved':
        # set accepted_doctor_id to current user id
        consult.accepted_doctor_id = request.user
        consult.consult_status = "Active"
        ############### OPENTOK FOR CREATING SESSION ID. FOR DOCUMENTATION, REFER : https://tokbox.com/developer/sdks/python/ ####################
        opentok = OpenTok(
            '47346661', '43a8b8e057ad39e7d45d2658de8ca55a3f4f6952')
        # Create a session that attempts to send streams directly between clients (falling back
        # to use the OpenTok TURN server to relay streams if the clients cannot connect):
        session = opentok.create_session()
        # A session that uses the OpenTok Media Router, which is required for archiving:
        session = opentok.create_session(media_mode=MediaModes.routed)
        # A session with a location hint
        session = opentok.create_session(location=u'12.34.56.78')
        # Store this session ID in the database
        session_id = session.session_id
        ################## CREATE AN APPOINTMENT ##################
        appointment = Appointment_table.objects.create(
            consult_id=consult.consult_id,
            patient_id=consult.patient_id_id,
            doctor=request.user,
            session_time=None,
            status='active',
            appointment_time=consult.preferred_time,
            video_session=session_id
        )

        patient = CustomUser.objects.get(id=consult.patient_id_id)

        user_data = CustomUserSerializer(patient).data

        cursor = connection.cursor()
        cursor.execute(
            f'''select convert_tz('{appointment.appointment_time}','UTC','{user_data['ustime_zone_names']['abbrevation']}');''')

        timezonename = user_data['ustime_zone_names']['timezone_name'][-5:]
        print('timezonename', timezonename)
        row = cursor.fetchone()
        # convert 24 hr to 12 hr format
        hr = row[0].hour
        min = row[0].minute
        if (hr > 12):
            ampm = "PM"
        else:
            ampm = "AM"
        if (hr % 12 == 0):
            hr = 12
        if (hr % 12 != 0):
            hr = hr % 12

        if hr < 10:
            hr = "0" + str(hr)

        if min < 10:
            min = "0" + str(min)

        twelvehr = str(hr) + ":" + str(min) + " " + str(ampm)

        formatteddate = row[0].day
        formattedmonth = row[0].month

        if formatteddate < 10:
            formatteddate = "0" + str(formatteddate)

        if formattedmonth < 10:
            formattedmonth = "0" + str(formattedmonth)

        formatteddatemonth = str(
            formatteddate) + "-" + str(formattedmonth) + "-" + str(row[0].year)

        print('12hr format:', twelvehr)

        # timepref = row.strptime('%d-%m-%Y %I:%M:%S')
        print('timepref', row)

        subject = 'Consult Confirmed - Consult Medic'
        message = f'<h2 style="text-align:center; background-color:#1976D2;color:white">Consult Medic</h2><br/>Hi <b>{consult.patient_id.first_name}</b>,<br /><br />Your consult has been confirmed at <i>Consult Medic.</i><br /><br /><b>Your consult booking details are described below:</b><br/>Name:{consult.patient_id.first_name} {consult.patient_id.last_name}<br />Email : {consult.email}<br />Preferred date & time : {formatteddatemonth} at {twelvehr} {timezonename}<br />Status: Confirmed<br /><br /><div style=margin-top:100px;color:grey><i>Thank You for using Consult Medic. We heal your soul</i></div>'

        email_from = settings.EMAIL_HOST_USER
        recipient_list = [consult.email]

        send_mail(subject, message='', from_email=email_from, html_message=message,
                  recipient_list=recipient_list)
        serializer = Appointment_serializer(appointment, many=False)
    consult.save()
    # consult.patient_id = recipient_id
    # consult.save()
    serializer = ConsultTableSerializer(consult, many=False)
    return Response(serializer.data)
# Doctor Withdraw


@ api_view(['PUT', 'GET'])
@ permission_classes([IsAuthenticated])
def doctorwithdraw(request, pk):
    data = request.data

    # get consult
    consult = Consult_table.objects.get(
        consult_id=pk, accepted_doctor_id=request.user.id)
    if request.user.user_type == "Doctor":
        receiver = consult.patient_id
        create_notification(request.user, receiver, 'CONSULT_WITHDRAWN',
                            'Your consult id  {} has been returned by doctor'.format(consult.consult_id))
    # if consult status is 'Approved' by admin
    if consult.consult_status == 'Approved' or consult.consult_status == 'Active':
        # set accepted_doctor_id to None
        consult.accepted_doctor_id = None
        consult.consult_status = "Approved"
        appointment = Appointment_table.objects.get(
            consult_id=pk)
        appointment.delete()
    consult.save()
    serializer = ConsultTableSerializer(consult, many=False)
    return Response(serializer.data)


@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def patConsultList(request):

    # Search by keyword
    # query = request.query_params.get('keyword')
    # if query == None:
    #     query = ''

    # sortBy and sortOrder
    sortBy = request.query_params.get('sortBy', 'consult_id')
    sortOrder = request.query_params.get('sortOrder', 'desc')
    if sortOrder != 'asc':
        sortBy = '-' + sortBy
    # get consults by patient id
    consults = Consult_table.objects.filter(
        patient_id=request.user.id).order_by(sortBy)
    # consult = Consult_table.objects.get(
    #     consult_id=request.data["consult_id"])
    # if request.user.user_type == "Patient":

    #     receiver = consult.accepted_doctor_id

    #     create_notification(request.user, receiver, 'CONSULT_REQUEST',
    #                         'Consult Request')
    # For Pagination
    page = request.query_params.get('page')
    # Paginator in this case takes in new_consults we want to paginage, and number means how many should come up on one page
    paginator = Paginator(consults, 10)
    try:
        # if we pass in a page, 'paginator' and 'page' is defined above
        consults = paginator.page(page)
    except PageNotAnInteger:
        # when we have not clicked on a page, means we are on page 1
        consults = paginator.page(1)
    except EmptyPage:
        # If we have am empty page (meaning the page has no products)
        consults = paginator.page(paginator.num_pages)
    # If for some reason the frontend has some errors
    if page == None:
        page = 1
    # we want our page to always be an integer
    # page = int(page)
    serializer = ConsultTableSerializer(consults, many=True)

    # Get unread messages for consult
    serialized_data = serializer.data
    for data in serialized_data:
        unread_message_count = Message_table.objects.filter(
            consult_id=data['consult_id'], unread_message=1, recipient_id=request.user.id).count()
        data['unread_message_count'] = unread_message_count

    return Response({'consults': serialized_data, 'page': page, 'pages': paginator.num_pages})


# Consult Withdraw By Patinet
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def patientwithdraw(request, pk):
    data = request.data
    # get consult
    consult = Consult_table.objects.get(
        consult_id=pk)

    # if consult status is 'Approved' by admin
    if consult.consult_status == 'Approved' or consult.consult_status == 'Active':
        consult.consult_status = "Inactive"
    consult.save()
    serializer = ConsultTableSerializer(consult, many=False)
    return Response(serializer.data)

# Message Count


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def message_count(request):
    consult_messages = Message_table.objects.filter(
        consult_id=request.GET.get('consult_id'), recipient_id=request.user.id, unread_message=1).count()
    return Response(consult_messages)


# Read Message
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def read_message(request, pk):
    print('..request.user.id', request.user.id)

    Message_table.objects.filter(
        consult_id_id=pk, recipient_id=request.user.id, unread_message=1).update(unread_message=0)

    return Response({'success': True})
