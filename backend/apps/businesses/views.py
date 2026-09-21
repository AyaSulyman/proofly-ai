from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError

from apps.community.models import Review

from .models import Business, BusinessVerification
from .serializers import (
    BusinessCreateSerializer,
    BusinessDetailSerializer,
    BusinessListSerializer,
    BusinessVerificationSerializer,
    ReviewSerializer,
)


class BusinessSearchView(generics.ListAPIView):
    """GET /api/businesses/?q=techworld — powers the Search page and the
    hero/For-Consumers/For-Businesses search bars (they all submit to
    /search on the frontend, which calls this endpoint)."""

    serializer_class = BusinessListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Business.objects.all()
        q = self.request.query_params.get("q", "").strip()
        if q:
            qs = qs.filter(
                Q(name__icontains=q)
                | Q(website__icontains=q)
                | Q(phone__icontains=q)
                | Q(email__icontains=q)
                | Q(category__icontains=q)
                | Q(location__icontains=q)
            )
        kind = self.request.query_params.get("type", "all").strip().lower()
        if kind == "business":
            qs = qs.filter(is_individual=False)
        elif kind == "individual":
            qs = qs.filter(is_individual=True)
        elif kind == "website":
            qs = qs.exclude(website="").exclude(website__isnull=True)
        return qs


class BusinessDetailView(generics.RetrieveAPIView):
    """GET /api/businesses/{id}/ — the public trust profile page."""

    queryset = Business.objects.all()
    serializer_class = BusinessDetailSerializer
    permission_classes = [permissions.AllowAny]


class BusinessClaimView(generics.CreateAPIView):
    """POST /api/businesses/claim/"""

    serializer_class = BusinessCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role_name != "business":
            raise ValidationError({"detail": "A business account is required to claim a profile."})
        if Business.objects.filter(owner=self.request.user).exists():
            raise ValidationError({"detail": "You have already claimed a business profile."})
        serializer.save()


class MyBusinessesView(generics.ListAPIView):
    """GET /api/businesses/mine/ — for a Business-role user's own profile(s)."""

    serializer_class = BusinessListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Business.objects.filter(owner=self.request.user)


class BusinessReviewListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/businesses/{business_id}/reviews/"""

    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Review.objects.filter(business_id=self.kwargs["business_id"]).order_by("-created_at")

    def perform_create(self, serializer):
        business = get_object_or_404(Business, pk=self.kwargs["business_id"])
        if business.owner_id == self.request.user.id:
            raise ValidationError({"detail": "You cannot review your own business."})
        serializer.save(business=business)


class BusinessVerificationCreateView(generics.CreateAPIView):
    """POST /api/businesses/{business_id}/verification/ — submit documents."""

    serializer_class = BusinessVerificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        business = get_object_or_404(Business, pk=self.kwargs["business_id"], owner=self.request.user)
        serializer.save(business=business)
