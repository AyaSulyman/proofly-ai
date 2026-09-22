from django.core.management.base import BaseCommand, CommandError

from apps.investigations import ai_client


class Command(BaseCommand):
    help = "Make one real structured request to verify the configured Proofly AI provider."

    def handle(self, *args, **options):
        self.stdout.write("Checking the configured AI provider...")
        try:
            provider = ai_client.check_provider()
        except ai_client.AIProviderError as exc:
            raise CommandError(f"{exc} (code: {exc.code})") from exc
        self.stdout.write(self.style.SUCCESS(f"AI provider is working: {provider}"))
