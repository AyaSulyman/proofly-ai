from django.contrib import admin

from .models import Business, BusinessVerification


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "category",
        "is_individual",
        "verification_status",
        "risk_level",
        "risk_score",
        "rating",
        "review_count",
        "owner",
        "created_at",
    ]
    list_filter = ["verification_status", "risk_level", "is_individual"]
    search_fields = ["name", "website", "email", "phone"]
    readonly_fields = ["id", "created_at", "updated_at", "rating", "review_count"]


@admin.register(BusinessVerification)
class BusinessVerificationAdmin(admin.ModelAdmin):
    list_display = ["business", "status", "reviewed_by", "reviewed_at", "created_at"]
    list_filter = ["status"]
    actions = ["approve", "reject"]

    @admin.action(description="Approve selected verifications")
    def approve(self, request, queryset):
        from django.utils import timezone

        for v in queryset:
            v.status = BusinessVerification.APPROVED
            v.reviewed_by = request.user
            v.reviewed_at = timezone.now()
            v.save()
            v.business.verification_status = "verified"
            v.business.save(update_fields=["verification_status"])

    @admin.action(description="Reject selected verifications")
    def reject(self, request, queryset):
        from django.utils import timezone

        queryset.update(status=BusinessVerification.REJECTED, reviewed_by=request.user, reviewed_at=timezone.now())
