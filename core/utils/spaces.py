from json import loads
from boto3 import session
from botocore.client import Config
from os import getenv
from django.conf import settings

from core.models import Attachment

session = session.Session()
spaces_client = session.client(
    "s3",
    region_name=getenv("DO_SPACES_REGION", "blr1"),
    endpoint_url=getenv("DO_SPACES_ENDPOINT"),
    aws_access_key_id=getenv("DO_SPACES_ACCESS_KEY"),
    aws_secret_access_key=getenv("DO_SPACES_SECRET_KEY"),
    config=Config(s3={"addressing_style": "virtual"}),
)


def upload_file_obj(file, created_by=None, media_id=None, create_media=True):
    attachment_id = media_id
    raw_file_name = getattr(file, "name", "")
    content_type = getattr(file, "content_type", None)
    size = getattr(file, "size", None)
    raw_file_ext = raw_file_name.split(".")[-1].lower()
    access = "public-read"
    bucket = settings.BUCKET
    key = f"{settings.ENVIRONMENT[0]}/{attachment_id}.{raw_file_ext}"
    params = dict(
        Bucket=bucket,
        Key=key,
        Body=file,
        ACL=access,
        ContentType=content_type,
    )
    response = spaces_client.put_object(**params)
    media_dict = {
        "key": key,
        "mime_type": content_type,
        "url": f"https://onroadcdn.blr1.digitaloceanspaces.com/{key}",
        "etag": loads(response["ETag"]),
        "size": size,
        "created_by": created_by,
    }
    if response["ETag"] is not None and create_media and created_by:
        media, _ = Attachment.objects.update_or_create(
            id=attachment_id,
            defaults={**media_dict},
        )
        return media
    if response["ETag"]:
        return media_dict
    return None
