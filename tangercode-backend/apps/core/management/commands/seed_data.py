from django.core.management.base import BaseCommand

from apps.languages.models import Language
from apps.services.models import Technology
from apps.core.models import PageSEO, PageSEOTranslation, SiteConfig, SiteConfigTranslation
from apps.users.models import User


class Command(BaseCommand):
    help = "Seed the database with initial data (languages, technologies, SEO, superadmin)"

    def handle(self, *args, **options):
        self._seed_languages()
        self._seed_technologies()
        self._seed_seo()
        self._seed_ai_provider()
        self._seed_prompts()
        self._seed_superadmin()
        self.stdout.write(self.style.SUCCESS("Seed data loaded successfully."))

    def _seed_languages(self):
        languages = [
            {"code": "fr", "name": "Français", "native_name": "Français", "is_default": True, "is_rtl": False, "order": 1},
            {"code": "en", "name": "English", "native_name": "English", "is_default": False, "is_rtl": False, "order": 2},
            {"code": "ar", "name": "Arabic", "native_name": "العربية", "is_default": False, "is_rtl": True, "order": 3},
        ]
        for lang in languages:
            obj, created = Language.objects.get_or_create(code=lang["code"], defaults=lang)
            if not created:
                for key, value in lang.items():
                    setattr(obj, key, value)
                obj.save()
            self.stdout.write(f"  Language: {obj.code} — {'created' if created else 'updated'}")

    def _seed_technologies(self):
        technologies = [
            ("Next.js", "nextjs", "frontend", "#000000"),
            ("React", "react", "frontend", "#61DAFB"),
            ("TypeScript", "typescript", "frontend", "#3178C6"),
            ("Tailwind CSS", "tailwind", "frontend", "#06B6D4"),
            ("Django", "django", "backend", "#092E20"),
            ("Python", "python", "backend", "#3776AB"),
            ("Node.js", "nodejs", "backend", "#339933"),
            ("Flutter", "flutter", "mobile", "#02569B"),
            ("PostgreSQL", "postgresql", "database", "#4169E1"),
            ("Docker", "docker", "devops", "#2496ED"),
            ("Three.js", "threejs", "frontend", "#000000"),
            ("AWS", "aws", "devops", "#FF9900"),
        ]
        for i, (name, slug, category, color) in enumerate(technologies):
            obj, created = Technology.objects.get_or_create(
                slug=slug,
                defaults={"name": name, "category": category, "color": color, "order": i},
            )
            if not created:
                obj.name = name
                obj.category = category
                obj.color = color
                obj.order = i
                obj.save()
            self.stdout.write(f"  Technology: {obj.name} — {'created' if created else 'updated'}")

    def _seed_seo(self):
        pages = [
            ("home", "Accueil"),
            ("services", "Services"),
            ("portfolio", "Portfolio"),
            ("pricing", "Tarifs"),
            ("blog", "Blog"),
            ("about", "À propos"),
            ("faq", "FAQ"),
            ("contact", "Contact"),
        ]
        languages = Language.objects.all()
        for page_key, name in pages:
            page, _ = PageSEO.objects.get_or_create(page_key=page_key)
            for lang in languages:
                PageSEOTranslation.objects.get_or_create(
                    page=page,
                    language=lang,
                    defaults={
                        "meta_title": f"TANGER CODE — {name}",
                        "meta_description": f"{name} — Développement web & mobile sur mesure à Tanger",
                    },
                )
            self.stdout.write(f"  PageSEO: {page_key}")

    def _seed_superadmin(self):
        if not User.objects.filter(is_superuser=True).exists():
            user = User.objects.create_superuser(
                email="admin@tangercode.com",
                password="Admin12345!",
                first_name="Admin",
                last_name="TangerCode",
            )
            self.stdout.write(f"  Superadmin created: {user.email} (password: Admin12345!)")
        else:
            self.stdout.write("  Superadmin already exists (skipped)")

    def _seed_ai_provider(self):
        from apps.translation.models import AIProvider

        if not AIProvider.objects.filter(is_active=True).exists():
            provider = AIProvider.objects.create(
                name="Claude Sonnet",
                provider_type="claude",
                model_name="claude-3-5-sonnet-20241022",
                is_default=True,
                is_active=True,
            )
            self.stdout.write(f"  AI Provider created: {provider.name} (needs API key configured)")
        else:
            self.stdout.write("  AI Provider already exists (skipped)")

    def _seed_prompts(self):
        from apps.translation.models import TranslationPrompt

        defaults = [
            ("Texte court (default)", "default", True),
            ("Texte long (description)", "long_text", True),
            ("Texte riche (article HTML)", "rich_text", True),
            ("Liste (features)", "list", True),
        ]
        prompt_template = (
            "You are a professional translator specializing in tech and web development content.\n\n"
            "TASK: Translate the following {field_type} from {source_language} to {target_language}.\n\n"
            "RULES:\n"
            "- Maintain the original tone and style\n"
            "- Keep technical terms in English (e.g. \"Next.js\", \"Django\", \"API\", \"ERP\")\n"
            "- Keep brand names unchanged (\"TANGER CODE\")\n"
            "- Preserve HTML tags if present\n"
            "- For Arabic: use Modern Standard Arabic, professional tone\n"
            "- For French: use a professional but accessible tone\n"
            "- Return ONLY the translation, no explanations, no quotes\n\n"
            "CONTENT TO TRANSLATE:\n{content}\n\nTRANSLATION:"
        )
        for name, field_type, is_default in defaults:
            obj, created = TranslationPrompt.objects.get_or_create(
                field_type=field_type,
                defaults={"name": name, "prompt_template": prompt_template, "is_default": is_default},
            )
            if not created:
                obj.name = name
                obj.prompt_template = prompt_template
                obj.is_default = is_default
                obj.save()
            self.stdout.write(f"  Translation Prompt: {obj.name} ({obj.field_type}) — {'created' if created else 'updated'}")
