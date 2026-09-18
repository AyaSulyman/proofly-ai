from django.urls import path

from . import views

urlpatterns = [
    path("", views.BusinessSearchView.as_view(), name="business-search"),
    path("mine/", views.MyBusinessesView.as_view(), name="business-mine"),
    path("claim/", views.BusinessClaimView.as_view(), name="business-claim"),
    path("<uuid:pk>/", views.BusinessDetailView.as_view(), name="business-detail"),
    path("<uuid:business_id>/reviews/", views.BusinessReviewListCreateView.as_view(), name="business-reviews"),
    path(
        "<uuid:business_id>/verification/",
        views.BusinessVerificationCreateView.as_view(),
        name="business-verification",
    ),
]
