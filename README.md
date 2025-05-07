# CS732 project - Team Marvelous Moose

Welcome to the CS732 project. We look forward to seeing the amazing things you create this semester! This is your team's repository.

Your team members are:
- Shiyun Lu _(slu961@aucklanduni.ac.nz)_
- Jiaxin Liu _(jilu916@aucklanduni.ac.nz)_
- Xindi Hu _(xhu694@aucklanduni.ac.nz)_
- Zhiliang Luo _(zluo443@aucklanduni.ac.nz)_
- Luis Rodriguez _(lrdo555@aucklanduni.ac.nz)_
- Pradnesh Bhamare _(pbha181@aucklanduni.ac.nz)_

You have complete control over how you run this repo. All your members will have admin access. The only thing setup by default is branch protections on `main`, requiring a PR with at least one code reviewer to modify `main` rather than direct pushes.

Please use good version control practices, such as feature branching, both to make it easier for markers to see your group's history and to lower the chances of you tripping over each other during development

![](./Marvelous%20Moose.webp)

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
| Blackout DB    | http://localhost:5000           |
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
MONGO_URI=mongodb://mongo:27017/blackoutdb
PORT=5000
BLACKOUT_APP_URL=http://localhost:5173
```

### `clients/blackout-app/.env`
```env
VITE_API_BASE=http://localhost:5050/
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

