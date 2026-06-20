from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()

router.register(r"services", views.ServiceViewSet, basename="public-services")
router.register(r"projects", views.ProjectViewSet, basename="public-projects")
router.register(r"blog/posts", views.BlogPostViewSet, basename="public-blog-posts")
router.register(r"blog/categories", views.BlogCategoryViewSet, basename="public-blog-categories")
router.register(r"blog/tags", views.BlogTagViewSet, basename="public-blog-tags")
router.register(r"pricing", views.PricingTierViewSet, basename="public-pricing")
router.register(r"testimonials", views.TestimonialViewSet, basename="public-testimonials")
router.register(r"technologies", views.TechnologyViewSet, basename="public-technologies")

urlpatterns = router.urls
urlpatterns += [
    path("faq/", views.FAQViewSet.as_view({"get": "list"}), name="public-faq"),
    path("site-config/", views.SiteConfigView.as_view(), name="public-site-config"),
    path("site-config/seo/<str:page_key>/", views.SiteConfigSEOView.as_view(), name="public-site-config-seo"),
    path("contact/", views.ContactView.as_view(), name="public-contact"),
]
