# TANGER CODE — Backend

API REST Django pour le site vitrine TANGER CODE.

## Stack

- Python 3.12+, Django 5.1+, Django REST Framework
- PostgreSQL 16, Redis 7
- Celery + Celery Beat
- JWT auth (djangorestframework-simplejwt)
- Argon2 password hashing
- Swagger documentation (drf-spectacular)

## Quick start

```bash
# From project root, run all services:
cd ..
docker-compose up

# Or, to run only the backend:
docker-compose up backend postgres redis
```

## Local development (without Docker)

```bash
# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements/dev.txt

# Set environment variables
cp ../.env.example ../.env  # edit variables

# Run migrations
python manage.py migrate

# Run server
python manage.py runserver
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/health/` | Health check |
| `GET /api/docs/` | Swagger documentation |

## Commands

```bash
python manage.py makemigrations  # Create migrations
python manage.py migrate         # Apply migrations
python manage.py createsuperuser # Create admin
pytest                           # Run tests
pytest --cov                     # Test coverage
ruff check .                     # Linting
black .                          # Formatting
```
