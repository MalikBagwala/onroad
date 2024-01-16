FROM python:3.12-slim
LABEL maintainer="Malik Bagwala <hello@maalik.dev>"

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the Pipfile and Pipfile.lock to the container
COPY Pipfile Pipfile.lock /app/

# Get all the necessary deps
RUN apt-get update && apt-get install libpq-dev gcc gdal-bin -y

# Install project dependencies
RUN pip install pipenv \
    && pipenv install --system --deploy --ignore-pipfile

# Copy the Django project to the container
COPY . /app/

RUN chmod +x ./deploy.sh

# Collect static files
RUN python3 manage.py collectstatic --no-input

CMD ["./deploy.sh"]
