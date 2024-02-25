import redis
from django.conf import settings

# Initialize Redis connection
redis_instance = redis.StrictRedis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    decode_responses=True,  # Automatically decode responses to Python strings
)
