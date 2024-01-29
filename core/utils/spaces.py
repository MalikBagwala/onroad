from boto3 import session
from botocore.client import Config
from os import getenv

session = session.Session()
spaces_client = session.client(
    "s3",
    region_name=getenv("DO_SPACES_REGION", "blr1"),
    endpoint_url=getenv("DO_SPACES_ENDPOINT"),
    aws_access_key_id=getenv("DO_SPACES_ACCESS_KEY"),
    aws_secret_access_key=getenv("DO_SPACES_SECRET_KEY"),
    config=Config(s3={"addressing_style": "virtual"}),
)
