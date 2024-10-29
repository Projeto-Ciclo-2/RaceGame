# CopilotQuiz

Welcome to the **CopilotQuiz** repository!
CopilotQuiz is a real-time web application that allows users from all over the world to test their knowledge through interactive quizzes.

## Technologies Used

-   **Docker** - Containerization
-   **Node.js + Express** - Backend server
-   **Cookie + JWT** - Session management
-   **PostgreSQL** - Database
-   **React** - Frontend
-   **WebSocket** - Real-time communication

## Getting Started (Production)

### Prerequisites

Ensure you have the following installed:
- **Docker** (with Docker Compose)

### Steps to Run

1. **Build the Docker containers**
   Open a terminal in the project directory and run the following command:
   - Linux:
     ```bash
     docker-compose -f docker-compose.prod.yml build
     ```
   - Windows:
     ```bash
     docker compose -f docker-compose.prod.yml build
     ```

2. **Start the services**
   Once the build completes, start the services with:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Generate SSL certificates**
   Run the following command to configure SSL with Certbot (replace `alpha06.alphaedtech.org.br` with your domain):
   ```bash
   docker-compose -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d alpha06.alphaedtech.org.br
   ```

After setup, the following services will be available:
- Frontend (React): [http://localhost](http://localhost) (or your domain with HTTPS)
- Backend (API): [http://localhost:5000](http://localhost:5000)

### Note:
Make sure your domain is correctly pointed to your server's IP for Certbot to work.

## Getting Started (Development)

### Prerequisites

Ensure you have the following installed:
- **Docker** (with Docker Compose)

### Steps to Run

1. **Build the Docker containers**
   Open a terminal in the project directory and run the following command:
   - Linux:
     ```bash
     docker-compose -f docker-compose.dev.yml build
     ```
   - Windows:
     ```bash
     docker compose -f docker-compose.dev.yml build
     ```

   **Note:** _Docker Compose can sometimes be unstable during the build process. If you encounter issues, try restarting Docker._

2. **Start the services**
   Once the build completes, run:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

After setup, the following services will be available:
- Frontend (React): [http://localhost:80](http://localhost:80)
- Backend (API): [http://localhost:5000](http://localhost:5000)

## Documentation

Visit `/docs` for detailed API documentation, usage instructions, and other resources.
