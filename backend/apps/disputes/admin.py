from django.contrib import admin

from .models import Dispute, DisputeMessage


class DisputeMessageInline(admin.TabularInline):
    model = DisputeMessage
    extra = 0
    readonly_fields = ["created_at"]


@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ["id", "business", "status", "created_at", "resolved_at"]
    list_filter = ["status"]
    inlines = [DisputeMessageInline]
    readonly_fields = ["id", "created_at"]
