import redis
from django.conf import settings

# Initialize Redis connection
redis_instance = redis.StrictRedis.from_url(
    settings.REDIS_URL,
    decode_responses=True,  # Automatically decode responses to Python strings
)
