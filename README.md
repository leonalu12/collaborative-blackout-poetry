# CS732 project - Team Marvelous Moose

Welcome to the CS732 project. We look forward to you testing our project.

| Name              | Email                          | Git Accounts |
| ----------------- | ------------------------------ | ----------- |
| Shiyun Lu         | slu961@aucklanduni.ac.nz       | slu961 or leonalu12      |
| Jiaxin Liu        | jilu916@aucklanduni.ac.nz      | jilu916     |
| Xindi Hu          | xhu694@aucklanduni.ac.nz       | Punchilion  or Ogi0317    |
| Zhiliang Luo      | zluo443@aucklanduni.ac.nz      | zluo443 or SnowMoo     |
| Luis Rodriguez    | lrdo555@aucklanduni.ac.nz      | lrdo555 or luchiwards    |
| Pradnesh Bhamare  | pbha181@aucklanduni.ac.nz      | pbha181     |

![](./Marvelous%20Moose.webp)

# 💪 Proyect Website

## https://blackout-app.fly.dev


# 🛠️ Project Setup

This guide will help you quickly set up and run the Blackout full-stack project locally using Docker Compose, Node.js, React (Vite), Express, Redux, MongoDB, Jest, and Vitest.

---

## 🚀 Quick Start

### 📥 Install Required Software First

Make sure you have the following installed **before** running the project:

- [Docker](https://www.docker.com/products/docker-desktop) & Docker Desktop
- [Node.js](https://nodejs.org/en/download) (v20.x recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (for local development outside Docker, optional)
- [MongoDBCompass](https://www.mongodb.com/try/download/compass) (Helpfull to connect to DB and check tables)


### 📌 Prerequisites

- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/) (recommended v20.x LTS)

---

## 🧩 Project Structure

```
blackout-project/
├── clients/
│   └── blackout-app
├── servers/
│   └── blackout-db
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

---

## 🖥️ Local Development

## 📦 Installing Dependencies (Locally Without Docker)

To install the Node.js dependencies for local development or troubleshooting (outside Docker), run:

```bash
# From the root directory, for blackout-db server:
cd servers/blackout-db
npm install

# For blackout-app client:
cd ../../clients/blackout-app
npm install
```

---

### 🐳 Run Entire Stack with Docker Compose

```bash
docker compose up --build 
```

#### Populate the database with sample data use
```bash
docker exec -it group_project-blackout-db-1 npm run seed
```
This will add sample data to your database, only run for testing

Access your services:

| Service        | URL                             |
|----------------|---------------------------------|
| Blackout App   | http://localhost:5173           |
| Blackout DB    | http://localhost:5050           |
| MongoDB        | mongodb://localhost:27017       |

#### When done and want to quit use:

```bash
docker compose down
```

### 🧪 Running Tests

Run tests for specific services:

```bash
docker compose run blackout-app npm run test
docker compose up --build blackout-db-test
```

---

## 📦 Deployment

CI/CD configured with GitHub Actions:

- Push your code to `main` branch.
- GitHub Actions builds, tests, and optionally deploys your Docker images to Docker Hub or your server.

---

## ⚙️ Docker Compose Configuration

The full stack is orchestrated using Docker Compose.

- The configuration is located at: `docker-compose.yml`
- It defines three services: `blackout-app`, `blackout-db`, and `mongo`
- MongoDB includes a volume for data persistence and a health check
- The `build.target` for both app and server is currently set to `dev`, but should be updated to `prod` for production deployments

## 📁 .env Configuration for blackout-db

The app client and server uses a `.env` files please include these:

### `servers/blackout-db/.env`
```env
NODE_ENV=production
MONGO_URI=(Access Submitted apart)
PORT=5050
BLACKOUT_APP_URL=https://blackout-app.fly.dev/
OPENAI_API_KEY=(Key summited apart)
ALLOWED_ORIGINS=https://blackout-app.fly.dev,http://localhost:5173
```

### `clients/blackout-app/.env`
```env
VITE_API_BASE=https://blackout-db.fly.dev/
```

> 🔒 This file is excluded from version control via `.gitignore` and `.dockerignore`.

---

## 📝 Additional Notes

- Environment variables are managed via `.env` files (excluded from GitHub).
- Always use Node.js LTS for compatibility and stability.

---

## 🚧 Contributions

Feel free to submit pull requests or raise issues for any improvements.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

