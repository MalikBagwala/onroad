## Onroad Application

1. `make https` (install mkcert if you haven't already https://github.com/FiloSottile/mkcert)
2. `docker compose -f development.yml up` Will run the complete stack locally, you can make changes to the api server and client app and it will reflect without restarting
3. `docker compose up` Will run the complete stack locally in production setting
