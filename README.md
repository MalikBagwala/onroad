# OnRoad MonoRepo [Site Link](https://onroad.one)

1. **Setup HTTPS:**

   - Run `make https` (Install [mkcert](https://github.com/FiloSottile/mkcert) if not already installed)

2. **Local Development:**

   - Run `docker compose -f development.yml up`
   - Allows seamless development with real-time reflection of changes in both the API server and client app without the need for restarts.

3. **Local Production:**

   - Run `docker compose up`
   - Deploys the complete stack locally in a production setting, ensuring a consistent environment.

4. **Routes:**

   - `/*` → Front-end client
   - `/api*` → Django API
   - `/hasura*` → Hasura
   - `/rabbitmq*` → RabbitMQ Admin
   - `/media*` → File Server for uploaded Media Files
   - `/static*` → File Server for Django Static Assets

5. **Tech Stack:**

   - **Django:**

     - Handles data modeling, authentication, and custom APIs for robust server-side functionality.

   - **Hasura:**

     - Provides CRUD APIs, subscriptions, and potential future integration with CRON jobs for efficient data management.

   - **RabbitMQ:**

     - Serves as a reliable message broker to facilitate communication between various components of the application.

   - **Dramatiq:**

     - Utilized for spinning up workers that handle resource-intensive tasks, such as sending emails, ensuring optimal performance.

   - **Caddy:**

     - Acts as a reverse proxy and file server, managing routing and serving static files efficiently.

   - **Postgres:**

     - Chosen as the database for its reliability and efficiency in handling data storage requirements.

   - **Docker:**

     - Enables containerization, ensuring consistent and reproducible deployment across different environments.

   - **Terraform:**

     - Used for Infrastructure as Code (IaC) to manage infrastructure resources efficiently.

   - **Kubernetes:**

     - Optional but valuable for scaling deployment strategies, providing flexibility in managing containerized applications.

   - **Digital Ocean:**

     - Selected as the cloud provider of choice for hosting and managing the application in a scalable and reliable environment.

   - **React-Vite-Mantine:**
     - Employs a modern set of tools for rapidly developing a visually appealing Single Page Application (SPA).
