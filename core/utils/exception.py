from django.conf import settings
from sentry_sdk import capture_exception


def parse_exception(exception: Exception, message: str = "Something Went Wrong"):
    capture_exception(exception)
    if settings.DEBUG:
        return str(exception)
    else:
        return message
