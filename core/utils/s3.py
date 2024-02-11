import json
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


from PIL import Image
from io import BytesIO


def upload_file_obj(file, created_by=None, media_id=None, create_media=True):
    attachment_id = media_id
    raw_file_name = getattr(file, "name", "")
    content_type = getattr(file, "content_type", "")
    size = getattr(file, "size", None)
    raw_file_ext = raw_file_name.split(".")[-1].lower()

    # Check if file is an image
    if content_type.startswith("image"):
        # Open the image using PIL
        image = Image.open(file)
        # Convert image to WebP format
        webp_buffer = BytesIO()
        image.save(webp_buffer, format="WebP")
        webp_buffer.seek(0)
        # Update file with WebP data
        file = webp_buffer
        content_type = "image/webp"
        raw_file_ext = "webp"
        size = len(webp_buffer.getvalue())

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
        "etag": json.loads(response.get("ETag")),
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
