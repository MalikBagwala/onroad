# OnRoad MonoRepo [Visit Site](https://onroad.one)

1. **HTTPS Configuration:**

   - Execute `make https` command (Ensure [mkcert](https://github.com/FiloSottile/mkcert) is installed beforehand).

2. **Development Environment:**

   - Use `docker compose -f development.yml up` to set up.
   - Facilitates dynamic development, mirroring changes instantly in both the API server and client application without restarts.

3. **Production Environment Locally:**

   - Initiate with `docker compose up`.
   - Mimics the production setup locally, providing a uniform development-to-production transition.

4. **Application Routes:**

   - `/*` routes to the Front-end client interface.
   - `/api*` targets the Django API backend.
   - `/hasura*` directs to Hasura.
   - `/rabbitmq*` accesses RabbitMQ Admin.
   - `/media*` serves as the File Server for uploaded media.
   - `/static*` functions as the File Server for Django's static resources.

5. **Technology Stack:**

   - **Django:** Manages data structures, authentication, and custom APIs for comprehensive server-side solutions.
   - **Hasura:** Offers APIs for CRUD operations, real-time subscriptions, and future task scheduling features for streamlined data handling.
   - **RabbitMQ:** Acts as a dependable messaging system, enhancing communication across different application components.
   - **Dramatiq:** Deployed for executing background tasks like email dispatching, thereby maintaining system efficiency.
   - **Caddy:** Serves as the reverse proxy and static file server, optimizing routing and resource delivery.
   - **Postgres:** The database of choice, recognized for its reliability and performance in data management.
   - **Docker:** Facilitates application containerization, ensuring consistent deployment across various environments.
   - **Terraform:** Implements Infrastructure as Code (IaC) for streamlined management of infrastructure components. (Upcoming)
   - **Kubernetes:** An optional but beneficial tool for scaling applications, offering flexibility in container management. (Upcoming)
   - **Digital Ocean:** The preferred cloud service provider, known for its scalability and dependability in hosting solutions.
   - **React-Vite-Mantine:** Utilizes a modern toolkit for swift development of engaging Single Page Applications (SPAs).