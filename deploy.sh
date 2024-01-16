#!/bin/sh

set -e
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py createadmin
gunicorn onroad.wsgi:application --bind 0.0.0.0:9000 --workers=3
