from django.contrib import admin

from .models import AIAnalysisLog, Evidence, EvidenceConnection, Identifier, Investigation, RiskSignal


class IdentifierInline(admin.TabularInline):
    model = Identifier
    extra = 0


class EvidenceInline(admin.TabularInline):
    model = Evidence
    extra = 0


class RiskSignalInline(admin.TabularInline):
    model = RiskSignal
    extra = 0


@admin.register(Investigation)
class InvestigationAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "subject_type", "status", "risk_level", "risk_score", "created_at"]
    list_filter = ["status", "subject_type", "risk_level"]
    search_fields = ["title", "subject_name", "user__email"]
    readonly_fields = ["id", "created_at", "updated_at"]
    inlines = [IdentifierInline, EvidenceInline, RiskSignalInline]


@admin.register(EvidenceConnection)
class EvidenceConnectionAdmin(admin.ModelAdmin):
    list_display = ["identifier", "investigation", "connection_type", "status", "confidence_score", "created_at"]
    list_filter = ["connection_type", "status"]


@admin.register(AIAnalysisLog)
class AIAnalysisLogAdmin(admin.ModelAdmin):
    list_display = ["investigation", "feature_type", "model_used", "created_at"]
    list_filter = ["feature_type"]
    readonly_fields = [f.name for f in AIAnalysisLog._meta.fields]
