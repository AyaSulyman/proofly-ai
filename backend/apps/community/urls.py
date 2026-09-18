from django.urls import path

from . import views

urlpatterns = [
    path("reports/", views.MyReportsView.as_view(), name="community-reports"),
    path("reports/<uuid:pk>/", views.ReportDetailView.as_view(), name="community-report-detail"),
    path("reports/<uuid:pk>/decision/", views.ReportDecisionView.as_view(), name="community-report-decision"),
    path("reviews/mine/", views.MyReviewsView.as_view(), name="community-my-reviews"),
]
