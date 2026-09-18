from django.urls import path

from . import views

urlpatterns = [
    path("", views.MyDisputesView.as_view(), name="dispute-list"),
    path("<uuid:pk>/", views.DisputeDetailView.as_view(), name="dispute-detail"),
    path("<uuid:pk>/messages/", views.DisputeMessageCreateView.as_view(), name="dispute-messages"),
    path("<uuid:pk>/resolve/", views.DisputeResolveView.as_view(), name="dispute-resolve"),
]
