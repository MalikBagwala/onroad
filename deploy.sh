#!/bin/sh

set -e
python manage.py collectstatic --no-input

if [ "$RUN_MIGRATIONS" != "0" ]; then
    python manage.py migrate
fi

python manage.py createadmin

if [ "$ENVIRONMENT" = "production" ]; then
    gunicorn onroad.wsgi:application --bind 0.0.0.0:9000 --workers=3
else
    python manage.py runserver 0.0.0.0:9000
fi