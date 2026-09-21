from django.contrib import admin

from .models import CommunityReport, Review


@admin.register(CommunityReport)
class CommunityReportAdmin(admin.ModelAdmin):
    list_display = ["id", "category", "status", "reporter", "investigation", "created_at"]
    list_filter = ["status", "category"]
    search_fields = ["description", "reporter__email"]
    readonly_fields = ["id", "created_at"]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["business", "reviewer", "rating", "is_flagged", "created_at"]
    list_filter = ["is_flagged", "rating"]
