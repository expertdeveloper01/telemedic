"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_asgi_application()


# # mysite/asgi.py
# # from django.core.asgi import get_asgi_application

# # from channels.routing import get_default_application
# import os
# import django

# from channels.layers import get_channel_layer


# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
# django.setup()
# channel_layer = get_channel_layer()
# # django_asgi_app = get_default_application()

# from channels.auth import AuthMiddlewareStack
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.security.websocket import AllowedHostsOriginValidator
# import consultapp.routing

# application = ProtocolTypeRouter({
#     "http": get_channel_layer,
#     "websocket": AllowedHostsOriginValidator(
#         AuthMiddlewareStack(
#             URLRouter(consultapp.routing.websocket_urlpatterns)
#         ),
#     ),

#     # "websocket": AuthMiddlewareStack(
#     #     URLRouter(
#     #         consultapp.routing.websocket_urlpatterns
#     #     )
#     # ),
# })
