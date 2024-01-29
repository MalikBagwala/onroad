certs:
	mkcert --cert-file ./caddy/cert.crt --key-file ./caddy/cert.key localhost

makemigrations:
	docker-compose -f development.yml exec django python manage.py makemigrations

collectstatic:
	docker-compose -f development.yml exec django python manage.py collectstatic --noinput
migrate:
	docker-compose -f development.yml exec django python manage.py migrate

showmigrations:
	docker-compose -f development.yml exec django python manage.py showmigrations

loaddata:
	@read -p "Enter the name of the fixture(eg. groups.json): " input_file; \
	docker-compose -f development.yml exec django python manage.py loaddata $$input_file

hasura:
	cd hasura; and hasura console --admin-secret onroad --console-port 9800 --endpoint https://localhost/hasura/