from django.urls import path

from . import views

urlpatterns = [
    path("reports/", views.PendingReportsQueueView.as_view(), name="mod-reports-queue"),
    path("verifications/", views.PendingVerificationsQueueView.as_view(), name="mod-verifications-queue"),
    path("verifications/<int:pk>/decision/", views.VerificationDecisionView.as_view(), name="mod-verification-decision"),
    path("connections/", views.PendingConnectionsQueueView.as_view(), name="mod-connections-queue"),
    path("connections/<int:pk>/decision/", views.ConnectionDecisionView.as_view(), name="mod-connection-decision"),
    path("audit-log/", views.AuditLogListView.as_view(), name="mod-audit-log"),
]
