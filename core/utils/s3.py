from os import getenv
from django.conf import settings
from core.models import Attachment
import boto3

s3_client = boto3.client(
    "s3",
    aws_access_key_id=getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=getenv("AWS_REGION", "ap-south-1"),
)


def upload_file_obj(file, created_by=None, media_id=None, create_media=True):
    attachment_id = media_id
    raw_file_name = getattr(file, "name", "")
    content_type = getattr(file, "content_type", None)
    size = getattr(file, "size", None)
    raw_file_ext = raw_file_name.split(".")[-1].lower()
    bucket = settings.BUCKET
    key = f"{settings.ENVIRONMENT[0]}/{attachment_id}.{raw_file_ext}"
    params = dict(
        Bucket=bucket,
        Key=key,
        Body=file,
        ContentType=content_type,
    )
    response = s3_client.put_object(**params)
    media_dict = {
        "key": key,
        "mime_type": content_type,
        "url": f"https://s3.ap-south-1.amazonaws.com/{bucket}/{key}",
        "etag": response.get("ETag"),
        "size": size,
        "created_by": created_by,
    }
    if response.get("ETag") and create_media and created_by:
        media, _ = Attachment.objects.update_or_create(
            id=attachment_id,
            defaults={**media_dict},
        )
        return media
    if response.get("ETag"):
        return media_dict
    return None
