from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("investigations", "0002_investigation_analysis_provider_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="evidence",
            name="analysis_provider",
            field=models.CharField(blank=True, max_length=40),
        ),
        migrations.AddField(
            model_name="evidence",
            name="analyzed_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
