from django.urls import include, path
from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()

router.register(r"services", views.ServiceAdminViewSet, basename="admin-services")
router.register(r"projects", views.ProjectAdminViewSet, basename="admin-projects")
router.register(r"blog/posts", views.BlogPostAdminViewSet, basename="admin-blog-posts")
router.register(r"blog/categories", views.BlogCategoryAdminViewSet, basename="admin-blog-categories")
router.register(r"blog/tags", views.BlogTagAdminViewSet, basename="admin-blog-tags")
router.register(r"pricing", views.PricingTierAdminViewSet, basename="admin-pricing")
router.register(r"testimonials", views.TestimonialAdminViewSet, basename="admin-testimonials")
router.register(r"faq-categories", views.FAQCategoryAdminViewSet, basename="admin-faq-categories")
router.register(r"faq", views.FAQAdminViewSet, basename="admin-faq")
router.register(r"technologies", views.TechnologyAdminViewSet, basename="admin-technologies")
router.register(r"messages", views.ContactMessageAdminViewSet, basename="admin-messages")
router.register(r"languages", views.LanguageAdminViewSet, basename="admin-languages")
router.register(r"users", views.UserAdminViewSet, basename="admin-users")

urlpatterns = router.urls
urlpatterns += [
    path("config/site/", views.SiteConfigAdminView.as_view(), name="admin-site-config"),
    path("config/seo/", views.PageSEOAdminView.as_view(), name="admin-seo-list"),
    path("config/seo/<str:page_key>/", views.PageSEOAdminView.as_view(), name="admin-seo-detail"),
    path("media/upload/", views.MediaUploadView.as_view(), name="admin-media-upload"),
    path("backups/", views.BackupView.as_view(), name="admin-backups"),
]
