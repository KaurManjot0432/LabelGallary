from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import UserSerializer, UserRegistrationSerializer, UserLoginSerializer

class UserRegistrationView(APIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({'message': 'User successfully registered.'}, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    serializer_class = UserLoginSerializer
    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        return Response({
            'message': 'User successfully logged in.',
            'access': serializer.validated_data['access'],
            'refresh': serializer.validated_data['refresh']
        }, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
