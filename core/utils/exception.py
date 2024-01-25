from django.conf import settings


def parse_exception(exception: Exception, message: str = "Something Went Wrong"):
    if settings.DEBUG:
        return str(exception)
    else:
        return message
