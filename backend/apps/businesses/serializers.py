from rest_framework import serializers

from apps.community.models import Review

from .models import Business, BusinessVerification


class BusinessListSerializer(serializers.ModelSerializer):
    """Matches lib/types.ts `Business` — used on /search and list contexts."""

    image_url = serializers.SerializerMethodField()
    member_since = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Business
        fields = [
            "id",
            "name",
            "category",
            "is_individual",
            "website",
            "email",
            "phone",
            "location",
            "image_url",
            "verification_status",
            "risk_level",
            "risk_score",
            "rating",
            "review_count",
            "member_since",
            "response_rate",
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class BusinessDetailSerializer(BusinessListSerializer):
    """The public trust-profile page additionally needs the owner id (so the
    frontend can show an "edit" affordance to the owning business user)."""

    owner_id = serializers.UUIDField(source="owner.id", read_only=True, default=None)

    class Meta(BusinessListSerializer.Meta):
        fields = BusinessListSerializer.Meta.fields + ["owner_id"]


class BusinessCreateSerializer(serializers.ModelSerializer):
    """POST /api/businesses/claim/ — "Claim Your Business" form."""

    class Meta:
        model = Business
        fields = ["name", "category", "website", "email", "phone", "location", "image"]

    def create(self, validated_data):
        request = self.context["request"]
        return Business.objects.create(owner=request.user, **validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source="reviewer.full_name", read_only=True)
    business = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ["id", "business", "reviewer_name", "rating", "comment", "is_flagged", "created_at"]
        read_only_fields = ["id", "reviewer_name", "is_flagged", "created_at"]

    def create(self, validated_data):
        request = self.context["request"]
        review = Review.objects.create(reviewer=request.user, **validated_data)
        review.business.recompute_review_stats()
        return review


class BusinessVerificationSerializer(serializers.ModelSerializer):
    business = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = BusinessVerification
        fields = ["id", "business", "document", "status", "reviewed_by", "reviewed_at", "created_at"]
        read_only_fields = ["id", "status", "reviewed_by", "reviewed_at", "created_at"]

    def create(self, validated_data):
        verification = BusinessVerification.objects.create(**validated_data)
        verification.business.verification_status = Business.PENDING
        verification.business.save(update_fields=["verification_status"])
        return verification
