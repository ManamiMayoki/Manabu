# Manabu

> An all-in-one AI-driven student companion platform supporting university students throughout their academic journey.

Manabu acts as a personalized career guide, an academic resource hub, and a mental health sanctuary - like a trusted friend a student can turn to whenever they need guidance.

![Status](https://img.shields.io/badge/status-in--development-yellow)
![Docker](https://img.shields.io/badge/containerized-Docker-2496ED)

---

## Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack & Architecture](#️-tech-stack--architecture)
- [Project Structure](#-project-structure)
- [Git Branching & Deployment Strategy](#-git-branching--deployment-strategy)
- [Getting Started](#-getting-started-local-development)
- [Environment Variables](#-environment-variables)
- [Running Tests](#-running-tests)
- [Core Project Team](#-core-project-team)
- [Contributing](#-contributing)

---

## About the Project

University life comes with three constant challenges: figuring out a career path, finding reliable study resources, and managing mental well-being - often all at once, and often without enough support.

**Manabu** brings all three into a single platform, so students don't have to juggle five different apps and websites. It combines AI-driven guidance with a community-powered resource hub and a safe space for mental wellness.

---

## Key Features

| Feature | Description |
|---|---|
| **Career Pathway Mapping** | Personalized roadmaps that help students discover and align with their ideal professional goals. |
| **Internship Sourcing** | A dedicated portal matching students with real-world industry placements and internships. |
| **Academic Hub** | A shared repository for crowd-sourced class notes and verified faculty research papers. |
| **Mental Health Support** | A safe, accessible space offering supportive resources and wellness tracking for students. |

---

## Tech Stack & Architecture

Manabu is built using a **containerized microservices architecture** to ensure seamless development and easy scaling.

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB/SQL |
| **Containerization** | Docker & Docker Compose |
| **CI/CD** | GitHub Actions (automated deployment to BDIX VPS via SSH) |


---

## Project Structure

```text
manabu/
├── .github/workflows/     # CI/CD pipeline automation (GitHub Actions)
├── backend/               # Node.js + Express.js server environment
├── frontend/              # React + Vite client application
├── sqa/                   # Automated testing scripts and documentation
├── docker-compose.yml     # Multi-container Docker configuration blueprint
└── README.md              # Project documentation and roadmap
```

---

## Git Branching & Deployment Strategy

To keep code deployment stable and predictable, the team follows a strict **3-branch workflow**:

| Branch | Purpose |
|---|---|
| `development` | The active workspace. Frontend and backend engineers branch off here and submit Pull Requests back into `development`. |
| `release` | The SQA testing environment. Code is promoted here for quality assurance and staging tests. |
| `production` | The live application environment. Merging here automatically triggers GitHub Actions to rebuild and deploy the latest Docker container to the BDIX live server. |

**Typical workflow:**
```text
feature/your-feature -> development -> release -> production
```

Always branch off `development`, never off `release` or `production` directly.

---

## Getting Started (Local Development)

### Prerequisites

Make sure have the following installed on machine:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/downloads)

### Installation & Run Steps

**1. Clone the repository and navigate to the root directory**

```bash
git clone https://github.com/ManamiMayoki/Manabu.git
cd Manabu
```

**2. Switch to the development branch**

```bash
git checkout development
```

**3. Spin up the entire environment (Frontend, Backend, and Database) with a single command**

```bash
docker-compose up --build
```

**4. Access the running application**

Once the containers build successfully, the services will be available at:

| Service | URL |
|---|---|
| Frontend | `http://localhost:3000` (or `http://localhost:5173` if using Vite's default) |
| Backend API | `http://localhost:5000` |

**5. Stopping the environment**

```bash
docker-compose down
```

---

## Environment Variables

Before running the project, create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

> Never commit `.env` file to version control. Make sure it's listed in `.gitignore`.

---

## Running Tests

Automated tests live in the `sqa/` directory. To run them:

```bash
cd sqa-testing
npm install
npm test
```

All Pull Requests into the `release` branch should pass these tests before promotion.

---

## Core Project Team

| Role | Name | Class Roll |
|---|---|---|
| Project Manager (PM) | [Marufa ] | 365 |
| Frontend Engineer | [Farjana Akter Anonna] | 361 |
| Backend Engineer | [Sanchita Rani Roy] | 371 |
| Software Quality Assurance (SQA) | [Beauty Paul] | 357 |

---

## Contributing

1. Fork the repository
2. Create feature branch from `development`: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add: your feature description"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request into `development`

---


<p align="center">Made with ❤️ by the Manabu Team</p>