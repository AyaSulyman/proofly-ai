from django.urls import path

from . import views

urlpatterns = [
    path("", views.InvestigationListCreateView.as_view(), name="investigation-list-create"),
    path("<uuid:pk>/", views.InvestigationDetailView.as_view(), name="investigation-detail"),
    path("<uuid:investigation_id>/identifiers/", views.IdentifierListCreateView.as_view(), name="investigation-identifiers"),
    path("<uuid:investigation_id>/evidence/", views.EvidenceListCreateView.as_view(), name="investigation-evidence"),
    path("<uuid:investigation_id>/evidence/<uuid:pk>/", views.EvidenceDetailView.as_view(), name="investigation-evidence-detail"),
    path("<uuid:investigation_id>/ai-review/", views.RunAIReviewView.as_view(), name="investigation-ai-review"),
    path("<uuid:investigation_id>/analyze/", views.AnalyzeInvestigationView.as_view(), name="investigation-analyze"),
    path("<uuid:investigation_id>/graph/", views.EvidenceGraphView.as_view(), name="investigation-graph"),
]
