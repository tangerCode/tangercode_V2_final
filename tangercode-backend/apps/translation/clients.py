import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class AIProviderClient(ABC):
    """Abstract interface for AI translation providers (Claude, OpenAI, Google, etc.)."""

    def __init__(self, api_key: str, base_url: str = "", model_name: str = "", max_tokens: int = 4096, temperature: float = 0.3):
        self.api_key = api_key
        self.base_url = base_url
        self.model_name = model_name
        self.max_tokens = max_tokens
        self.temperature = temperature

    @abstractmethod
    def translate(self, prompt: str) -> dict:
        """Call the provider API and return a structured result.

        Returns:
            {
                "translated_text": str,
                "input_tokens": int,
                "output_tokens": int,
            }
        """
        ...


class ClaudeClient(AIProviderClient):
    def translate(self, prompt: str) -> dict:
        import anthropic
        client = anthropic.Anthropic(api_key=self.api_key, base_url=self.base_url or None)
        response = client.messages.create(
            model=self.model_name,
            max_tokens=self.max_tokens,
            temperature=self.temperature,
            messages=[{"role": "user", "content": prompt}],
        )
        return {
            "translated_text": response.content[0].text.strip(),
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
        }


class OpenAIClient(AIProviderClient):
    def translate(self, prompt: str) -> dict:
        raise NotImplementedError("OpenAI client not yet implemented. Configure a Claude provider instead.")


class GoogleClient(AIProviderClient):
    def translate(self, prompt: str) -> dict:
        raise NotImplementedError("Google Gemini client not yet implemented. Configure a Claude provider instead.")


_PROVIDER_CLIENT_MAP = {
    "claude": ClaudeClient,
    "openai": OpenAIClient,
    "google": GoogleClient,
}


def get_provider_client(provider) -> AIProviderClient:
    """Factory: return the correct AIProviderClient subclass for a given AIProvider."""
    client_class = _PROVIDER_CLIENT_MAP.get(provider.provider_type)
    if not client_class:
        raise ValueError(f"Unknown provider type: {provider.provider_type}")
    api_key = provider.decrypted_api_key
    if not api_key:
        from django.conf import settings
        api_key = settings.ANTHROPIC_API_KEY or ""
    if not api_key:
        raise ValueError("No API key configured.")
    return client_class(
        api_key=api_key,
        base_url=provider.base_url,
        model_name=provider.model_name,
        max_tokens=provider.max_tokens,
        temperature=provider.temperature,
    )
