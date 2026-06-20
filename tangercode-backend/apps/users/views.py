import logging

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt import views as jwt_views

from . import serializers
from .models import ActivityLog

User = get_user_model()
logger = logging.getLogger(__name__)


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            user = User.objects.get(email=request.data.get("email"))
            user.last_login_ip = getattr(request, "_activity_ip", request.META.get("REMOTE_ADDR"))
            user.save(update_fields=["last_login_ip"])

            ip = getattr(request, "_activity_ip", request.META.get("REMOTE_ADDR"))
            ua = getattr(request, "_activity_user_agent", request.META.get("HTTP_USER_AGENT", ""))[:500]
            ActivityLog.objects.create(
                user=user,
                action=ActivityLog.Action.LOGIN,
                model_name="User",
                object_id=str(user.pk),
                ip_address=ip,
                user_agent=ua,
                details={"email": user.email},
            )
        except User.DoesNotExist:
            pass

        return Response(data, status=status.HTTP_200_OK)


class TokenRefreshView(jwt_views.TokenRefreshView):
    serializer_class = serializers.TokenRefreshSerializer


class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = serializers.LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ip = getattr(request, "_activity_ip", request.META.get("REMOTE_ADDR"))
        ua = getattr(request, "_activity_user_agent", request.META.get("HTTP_USER_AGENT", ""))[:500]
        ActivityLog.objects.create(
            user=request.user,
            action=ActivityLog.Action.LOGOUT,
            model_name="User",
            object_id=str(request.user.pk),
            ip_address=ip,
            user_agent=ua,
            details={"email": request.user.email},
        )

        return Response({"detail": "Logged out successfully"}, status=status.HTTP_200_OK)


class MeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = serializers.UserMeSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        serializer = serializers.UserMeSerializer(
            request.user, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = serializers.ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password changed successfully"}, status=status.HTTP_200_OK)


class PasswordResetView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = serializers.PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            logger.info(f"Password reset requested for unknown email: {email}")
            return Response(
                {"detail": "If the email exists, a reset link has been sent"},
                status=status.HTTP_200_OK,
            )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        logger.info(f"Password reset requested for {email} — uid/token: {uid}/{token[:8]}...")
        return Response(
            {"detail": "If the email exists, a reset link has been sent", "uid": uid, "token": token},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = serializers.PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = force_str(urlsafe_base64_decode(serializer.validated_data["uid"]))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Invalid reset link"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, serializer.validated_data["token"]):
            return Response({"detail": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        ActivityLog.objects.create(
            user=user,
            action=ActivityLog.Action.UPDATED,
            model_name="User",
            object_id=str(user.pk),
            details={"action": "password_reset"},
        )

        return Response({"detail": "Password has been reset successfully"}, status=status.HTTP_200_OK)
