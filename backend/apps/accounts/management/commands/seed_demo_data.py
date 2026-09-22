"""
Seeds the database with demo data mirroring frontend/lib/mock-data.ts, so
the backend is immediately useful for manual testing and for wiring the
frontend up to real endpoints later (same businesses, same investigation,
same dispute — just real DB rows with real UUIDs instead of hardcoded
mock ids).

Usage: python manage.py seed_demo_data [--flush]
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import Role, User
from apps.businesses.models import Business
from apps.community.models import CommunityReport, Review
from apps.disputes.models import Dispute, DisputeMessage
from apps.investigations.models import Evidence, Identifier, Investigation, RiskSignal
from apps.notifications.models import Notification


class Command(BaseCommand):
    help = "Seed demo data matching the frontend's mock-data.ts"

    def add_arguments(self, parser):
        parser.add_argument("--flush", action="store_true", help="Delete existing demo data first")

    @transaction.atomic
    def handle(self, *args, **options):
        if options["flush"]:
            self.stdout.write("Flushing existing data...")
            for model in [Notification, DisputeMessage, Dispute, CommunityReport, Review, Evidence, Identifier, RiskSignal, Investigation, Business]:
                model.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()

        roles = {name: Role.objects.get_or_create(name=name)[0] for name, _ in Role.NAME_CHOICES}

        # --- Users -----------------------------------------------------
        sara, _ = User.objects.get_or_create(
            email="sara.ahmed@email.com",
            defaults=dict(full_name="Sara Ahmed", phone="+961 71 234 567", location="Sidon, Lebanon", role=roles[Role.CONSUMER], is_verified=True),
        )
        sara.set_password("password123")
        sara.save()

        mod, _ = User.objects.get_or_create(
            email="moderator@proofly.ai",
            defaults=dict(full_name="Nadia Moderator", role=roles[Role.MODERATOR], is_verified=True, is_staff=True),
        )
        mod.set_password("password123")
        mod.save()

        techworld_owner, _ = User.objects.get_or_create(
            email="owner@techworld-store.com",
            defaults=dict(full_name="TechWorld Store Owner", role=roles[Role.BUSINESS], is_verified=True),
        )
        techworld_owner.set_password("password123")
        techworld_owner.save()

        quickrentals_owner, _ = User.objects.get_or_create(
            email="owner@quickrentals-lb.net",
            defaults=dict(full_name="QuickRentals LB Owner", role=roles[Role.BUSINESS]),
        )
        quickrentals_owner.set_password("password123")
        quickrentals_owner.save()

        self.stdout.write(self.style.SUCCESS("Users created (password for all: password123)"))

        # --- Businesses --------------------------------------------------
        businesses_data = [
            dict(name="TechWorld Store", category="Electronics & Gadgets", website="techworld-store.com",
                 location="Beirut, Lebanon", owner=techworld_owner, verification_status=Business.VERIFIED,
                 risk_level=Business.LOW, risk_score=18, rating=4.8, review_count=300, response_rate="96% within 2 hrs"),
            dict(name="RapidShip Sellers", category="General Marketplace", phone="+961 71 234 567",
                 verification_status=Business.UNVERIFIED, risk_level=Business.HIGH, risk_score=84, rating=2.1, review_count=14),
            dict(name="@global_tech_deals", category="Social Seller", is_individual=True,
                 verification_status=Business.UNVERIFIED, risk_level=Business.MEDIUM, risk_score=54, rating=3.2, review_count=9),
            dict(name="Maya Haddad — Freelance Designer", category="Freelance / Design", is_individual=True,
                 email="maya.h@studio.com", verification_status=Business.VERIFIED, risk_level=Business.LOW,
                 risk_score=12, rating=4.9, review_count=52),
            dict(name="QuickRentals LB", category="Short-term Rentals", website="quickrentals-lb.net",
                 owner=quickrentals_owner, verification_status=Business.UNVERIFIED, risk_level=Business.MEDIUM,
                 risk_score=58, rating=3.6, review_count=21),
        ]
        businesses = {}
        for data in businesses_data:
            biz, _ = Business.objects.get_or_create(name=data["name"], defaults=data)
            businesses[data["name"]] = biz
        self.stdout.write(self.style.SUCCESS(f"{len(businesses)} businesses created"))

        # --- Investigation: TechDeals Express (high risk, full flow) ----
        inv, created = Investigation.objects.get_or_create(
            user=sara,
            title="TechDeals Express — Instagram seller",
            defaults=dict(
                subject_type=Investigation.SELLER,
                status=Investigation.COMPLETED,
                subject_name="TechDeals Express",
                subject_url="instagram.com/techdeals.express",
                notes="Found this seller through a sponsored Instagram ad. Prices seem too good and they're asking for payment via wire transfer only.",
                risk_score=84,
                risk_level=Investigation.HIGH,
                summary=(
                    "This seller shows classic advance-payment fraud patterns: urgency language, "
                    "off-platform payment requests, and a very new account with low engagement "
                    "relative to claimed sales volume."
                ),
            ),
        )
        if created:
            Identifier.objects.create(investigation=inv, type=Identifier.URL, value="instagram.com/techdeals.express")
            Evidence.objects.create(
                investigation=inv, type=Evidence.SCREENSHOT, file_name="chat_screenshot_01.png", category="Content",
                extracted_data={"sellerName": "TechDeals Express", "product": "iPhone 16 Pro — 256GB", "priceQuoted": "$450"},
            )
            Evidence.objects.create(
                investigation=inv, type=Evidence.SCREENSHOT, file_name="payment_request.png", category="Payment",
            )
            Evidence.objects.create(
                investigation=inv, type=Evidence.URL, file_name="instagram.com/techdeals.express",
                text_value="instagram.com/techdeals.express",
            )
            for label, severity, category, impact in [
                ("Advance payment requested outside platform", "high", RiskSignal.PAYMENT, 20),
                ("Urgency / pressure language detected", "high", RiskSignal.CONTENT, 15),
                ("Price significantly below market average", "high", RiskSignal.CONTENT, 15),
                ("Account created 18 days ago", "medium", RiskSignal.TECHNICAL, 10),
                ("Linked to 2 other flagged seller accounts", "high", RiskSignal.NETWORK, 24),
            ]:
                RiskSignal.objects.create(investigation=inv, label=label, severity=severity, category=category, score_impact=impact, detected_by="ai")

        # --- A low-risk investigation for contrast -----------------------
        inv2, created2 = Investigation.objects.get_or_create(
            user=sara,
            title="Beachfront Studio — Batroun weekend rental",
            defaults=dict(
                subject_type=Investigation.RENTAL,
                status=Investigation.COMPLETED,
                risk_score=22,
                risk_level=Investigation.LOW,
                summary="Host has a consistent booking history, verified identity, and responsive communication.",
            ),
        )
        if created2:
            Evidence.objects.create(investigation=inv2, type=Evidence.SCREENSHOT, file_name="listing_screenshot.png")
            Evidence.objects.create(investigation=inv2, type=Evidence.SCREENSHOT, file_name="host_profile.png")
            RiskSignal.objects.create(investigation=inv2, label="No advance-payment pressure detected", severity="low", category=RiskSignal.CONTENT, score_impact=0, detected_by="ai")

        self.stdout.write(self.style.SUCCESS("2 demo investigations created"))

        # --- Community report + dispute on QuickRentals ------------------
        inv3, _ = Investigation.objects.get_or_create(
            user=sara, title="quickrentals-lb.net", defaults=dict(subject_type=Investigation.WEBSITE, status=Investigation.COMPLETED, risk_score=58, risk_level=Investigation.MEDIUM),
        )
        report, report_created = CommunityReport.objects.get_or_create(
            investigation=inv3,
            reporter=sara,
            category=CommunityReport.PAYMENT_ISSUE,
            defaults=dict(
                description=(
                    "Paid a $200 deposit for a short-term rental. The listing was removed within "
                    "hours and contact stopped. No refund after three follow-up emails over 8 days."
                ),
                status=CommunityReport.APPROVED,
            ),
        )
        if report_created:
            dispute = Dispute.objects.create(report=report, business=businesses["QuickRentals LB"], status=Dispute.AWAITING_CUSTOMER)
            DisputeMessage.objects.create(
                dispute=dispute, author=sara, author_role=DisputeMessage.REPORTER,
                text=report.description,
            )
            if quickrentals_owner:
                DisputeMessage.objects.create(
                    dispute=dispute, author=quickrentals_owner, author_role=DisputeMessage.BUSINESS,
                    text=(
                        "The listing was removed by our system because the host failed ID "
                        "verification. The deposit was held in escrow and a refund was initiated. "
                        "Attaching the refund confirmation."
                    ),
                )
            self.stdout.write(self.style.SUCCESS("Community report + dispute created"))

        # --- Notifications -------------------------------------------------
        Notification.objects.get_or_create(
            user=sara, title="High risk detected — TechDeals Express",
            defaults=dict(kind=Notification.INVESTIGATION, body="Your investigation completed with a risk score of 84/100."),
        )
        Notification.objects.get_or_create(
            user=sara, title="Report approved",
            defaults=dict(kind=Notification.REPORT, body="Your payment issue report is now visible on the public trust profile."),
        )

        self.stdout.write(self.style.SUCCESS("Seed complete."))
        self.stdout.write("Demo login: sara.ahmed@email.com / password123 (consumer)")
        self.stdout.write("Demo login: moderator@proofly.ai / password123 (moderator)")
        self.stdout.write("Demo login: owner@techworld-store.com / password123 (business)")
