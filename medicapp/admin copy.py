from django.contrib import admin
from .models import (
    Admin_table,
    CustomUser,
    Consult_table,

    Message_table,
    Age_group_table,
    Language_table,

    Notification_table,

)

# Register your models here.
admin.site.register(Admin_table)
admin.site.register(CustomUser)
admin.site.register(Consult_table)
admin.site.register(Notification_table)
admin.site.register(Message_table)
admin.site.register(Age_group_table)
admin.site.register(Language_table)
