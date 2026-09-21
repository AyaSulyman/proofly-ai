"""
Proofly AI — root URL configuration.

API is namespaced under /api/, grouped to match the frontend's route
groups (see frontend/app structure):
  /api/auth/            accounts (register, login, me, security)
  /api/businesses/      search, public trust profile, claim, reviews
  /api/investigations/  the full investigation flow
  /api/community/       community reports + "my reviews"
  /api/disputes/        the two-sided dispute thread
  /api/notifications/
  /api/moderation/      moderator queues (Batch F, trimmed scope)
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

admin.site.site_header = "Proofly Administration"
admin.site.site_title = "Proofly Admin"
admin.site.index_title = "Trust operations overview"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/businesses/", include("apps.businesses.urls")),
    path("api/investigations/", include("apps.investigations.urls")),
    path("api/community/", include("apps.community.urls")),
    path("api/disputes/", include("apps.disputes.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/moderation/", include("apps.moderation.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
