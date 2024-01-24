certs:
	mkcert --cert-file cert.crt --key-file cert.key localhost

makemigrations:
	docker-compose -f development.yml exec django python manage.py makemigrations

migrate:
	docker-compose -f development.yml exec django python manage.py migrate

showmigrations:
	docker-compose -f development.yml exec django python manage.py showmigrations

loaddata:
	@read -p "Enter the name of the fixture(eg. groups.json): " input_file; \
	docker-compose -f development.yml exec django python manage.py loaddata $$input_file