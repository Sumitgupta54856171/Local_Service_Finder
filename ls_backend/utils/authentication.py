from rest_framework_simplejwt.authentication import JWTAuthentication
from ls_backend.models import User

class CookieJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token.get('user_id')
            if not user_id:
                 return None
            user = User.objects.get(id=user_id)
            return user
        except (User.DoesNotExist, Exception):
            return None
    def get_role(self, validated_token):
        try:
            user_id = validated_token.get('user_id')
            if not user_id:
                 return None
            user = User.objects.get(id=user_id)
            return user.role
        except (User.DoesNotExist, Exception):
            return None
    def authenticate(self, request):
        raw_token = request.COOKIES.get('accessToken')
        print(f"Raw token from cookie: {raw_token}")

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        user = self.get_user(validated_token)
        return (user, validated_token) if user else None