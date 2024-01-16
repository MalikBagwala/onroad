certs:
	mkcert --cert-file cert.crt --key-file cert.key localhost

makemigrations:
	docker-compose -f development.yml exec django python manage.py makemigrations

migrate:
	docker-compose -f development.yml exec django python manage.py migrate

showmigrations:
	docker-compose -f development.yml exec django python manage.py showmigrations