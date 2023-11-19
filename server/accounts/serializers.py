from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'isAdmin', 'isStaff']

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    def validate(self, data):
        email = data['email']
        password = data['password']
        user = CustomUser.objects.get(email=email)
        user_fields = str(user).split('$')

        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            data['access'] = str(refresh.access_token)
            data['refresh'] = str(refresh)
            data['user'] = {
                'user_id' : user_fields[0],
                'email' : user_fields[1],
                'role' : user_fields[2]
            }
            return data
        else:
            raise serializers.ValidationError('Invalid login credentials')
