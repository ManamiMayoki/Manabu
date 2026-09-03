# Maorii

> Where every celebration comes to life. 🎉

**Maorii** is a full-stack festival event organizer platform that helps organizers create and manage festivals, publish events under them, and handle attendee registration, ticketing, and check-in — all from one system.

![Status](https://img.shields.io/badge/status-in--development-yellow)
![Docker](https://img.shields.io/badge/containerized-Docker-2496ED)

---

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Project Structure](#project-structure)
- [Git Branching & Deployment Strategy](#git-branching--deployment-strategy)
- [Getting Started](#getting-started-local-development)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Running Tests](#running-tests)
- [Core Project Team](#core-project-team)
- [Contributing](#contributing)

---

## About the Project

Organizing a festival usually means juggling spreadsheets for events, a separate system for ticket sales, and manual attendee check-in at the gate. **Maorii** brings all of that into a single platform.

Organizers can create a festival, add events under it (concerts, workshops, stalls, ceremonies, and more), and let participants register and receive a ticket — which can then be scanned in for attendance on the day of the event.

---

## Key Features

| Feature | Description |
|---|---|
| **Festival Management** | Create and manage festivals with dates, venue/location, banner & gallery images, pricing, and status (Draft, Upcoming, Ongoing, Completed, Cancelled). |
| **Event Scheduling** | Add multiple events per festival (Cultural, Concert, Workshop, Stall, Prize Ceremony, and more), each with its own venue, timing, capacity, and performer/guest list. |
| **Organizer Profiles** | Organizer accounts holding contact details, organization name, and the festivals/events they run. |
| **Registration & Ticketing** | Attendees register for an event, get an auto-generated ticket code, and can hold different ticket types (Regular, VIP, Student Pass, Early Bird). |
| **Attendance Check-In** | QR/ticket-code based check-in endpoint that marks a registration as attended and timestamps the check-in. |

---

## Tech Stack & Architecture

Maorii is built using a **containerized microservices architecture** (MERN-based) for straightforward local development and deployment.

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind (via utility classes) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (via Mongoose) |
| **Containerization** | Docker & Docker Compose (Nginx serves the built frontend) |
| **CI/CD** | GitHub Actions — automated API tests (Newman/Postman) and deployment to a VPS via SSH |

---

## Project Structure

```
maorii/
├── .github/workflows/          # CI/CD pipelines (API tests + deployment)
├── backend/                    # Node.js + Express API
│   ├── index.js                 # Entry point
│   └── src/
│       ├── app.js               # Express app & route wiring
│       ├── config/db.js         # MongoDB connection
│       ├── controllers/         # Festival, Event, Organizer, Registration logic
│       ├── middleware/          # Auth middleware
│       ├── models/              # Mongoose schemas
│       └── routes/              # REST API routes
├── frontend/                   # React + Vite client application
│   └── src/
├── tests/                      # Automated testing
│   ├── postman/                 # Core Postman collections
│   ├── postman_week3/           # Module-level API test collections
│   └── jmeter/                  # Load testing scripts
├── docker-compose.yml          # Multi-container Docker configuration
└── README.md                   # Project documentation
```

---

## Git Branching & Deployment Strategy

The team follows a strict **3-branch workflow**:

| Branch | Purpose |
|---|---|
| `development` | Active workspace. Engineers branch off here and submit Pull Requests back into `development`. |
| `release` | Staging/QA environment for testing before going live. |
| `production` | Live environment. Merging here triggers GitHub Actions to rebuild and deploy the Docker containers to the VPS. |

**Typical workflow:**

```
feature/your-feature -> development -> release -> production
```

Always branch off `development`, never off `release` or `production` directly.

---

## Getting Started (Local Development)

### Prerequisites

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

**3. Spin up the entire environment (Frontend, Backend, and Database)**

```bash
docker-compose up --build
```

**4. Access the running application**

| Service | URL |
|---|---|
| Frontend | `http://localhost:80` |
| Backend API | `http://localhost:5000` |
| MongoDB | `mongodb://localhost:27017` |

**5. Stopping the environment**

```bash
docker-compose down
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory (or rely on the defaults set in `docker-compose.yml`):

```
PORT=5000
MONGO_URI=mongodb://mongodb:27017/maorii_db
```

> Never commit your `.env` file to version control — make sure it's listed in `.gitignore`.

---

## API Overview

All routes are served under `/api`:

| Resource | Base Route | Notes |
|---|---|---|
| Festivals | `/api/festivals` | CRUD, filter by status, type, or city |
| Events | `/api/events` | CRUD, filter by festival or event type |
| Organizers | `/api/organizers` | CRUD |
| Registrations | `/api/registrations` | CRUD, supports bulk (array) creation |
| Attendance | `/api/registrations/scan-attendance` | Marks a ticket as attended via check-in scan |

---

## Running Tests

**API tests (Postman/Newman)** — module collections live in `tests/postman_week3/`:

```bash
npm install -g newman newman-reporter-htmlextra
newman run tests/postman_week3/Festival_tests.json --env-var "baseUrl=http://localhost:5000"
```

These also run automatically in CI on pushes/PRs to `development`, `release`, and `production`.

**Load tests** — a JMeter script is available at `tests/jmeter/load_test.jmx`.

---

## Core Project Team

| Role | Name | Class Roll |
|---|---|---|
| Project Manager (PM) | Marufa | 365 |
| Frontend Engineer | Farjana Akter Anonna | 361 |
| Backend Engineer | Sanchita Rani Roy | 371 |
| Software Quality Assurance (SQA) | Beauty Paul | 357 |

---

## Contributing

1. Fork the repository
2. Create a feature branch from `development`: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add: your feature description"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request into `development`

---

Made with ❤️ by the Maorii Team