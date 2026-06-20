from django.db import models
from django.utils.translation import get_language


class TranslatableMixin:
    translation_field = "translations"

    def get_translation(self, language_code=None):
        if language_code is None:
            language_code = get_language() or "fr"
        translations = getattr(self, self.translation_field)
        try:
            return translations.get(language__code=language_code)
        except (translations.model.DoesNotExist, AttributeError):
            pass
        return translations.filter(language__is_default=True).first()
