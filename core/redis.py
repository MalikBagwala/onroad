import redis
from django.conf import settings

# Initialize Redis connection
redis_instance = redis.StrictRedis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    decode_responses=True,  # Automatically decode responses to Python strings
)


def store_refresh_token(user_id, refresh_token, expires_in):
    """Store a refresh token in Redis with an expiration time."""
    # Key naming convention: "refresh_token:<user_id>"
    key = f"refresh_token:{user_id}"

    # Set the token in Redis with an expiration time (in seconds)
    redis_instance.setex(key, expires_in, refresh_token)


def get_refresh_token(user_id):
    """Retrieve a refresh token for a given user ID from Redis."""
    key = f"refresh_token:{user_id}"
    return redis_instance.get(key)


def delete_refresh_token(user_id):
    """Delete a refresh token for a given user ID from Redis."""
    key = f"refresh_token:{user_id}"
    redis_instance.delete(key)


print(get_refresh_token("579a19db-08d8-440c-987c-f9fc566182f8"))
