from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser
from .models import CustomUser

class AccessTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Get the access token from the request header
        access_token_str = request.headers.get('Authorization', '').split(' ')[-1]
        
        if access_token_str:
            try:
                # Decode the access token to get the user information
                access_token = AccessToken(access_token_str)

                user = CustomUser.objects.get(id=access_token['user_id'])
                request.user = user
            except Exception as e:
                # Handle token decoding or user retrieval errors
                request.user = AnonymousUser()

        response = self.get_response(request)
        return response
