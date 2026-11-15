# Chirpy 🐦

Chirpy is a small social media backend API inspired by platforms like Twitter (now X). Users can create accounts, publish short posts called *chirps*, and manage their accounts.

This project was built using **TypeScript, Node.js, Express, and PostgreSQL** as part of the Boot.dev backend development course.

## Features

- User registration and login
- Password hashing and secure authentication with JWTs
- Refresh token creation and revocation
- Create, retrieve, and delete chirps
- Filter chirps by author ID
- Sort chirps by creation date (ascending or descending)
- Profanity filtering
- Chirpy Red membership management
- Polka payment webhook integration
- Database migrations using Drizzle ORM
- HTTP error handling and middleware

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** JWT and Argon2
- **Development:** tsx

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js 22.14.0
- npm
- PostgreSQL

### Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd http_server
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DB_URL="postgres://postgres:postgres@localhost:5432/chirpy?sslmode=disable"
PORT=8080
PLATFORM=dev
JWT_SECRET="your-secret"
POLKA_KEY="your-polka-api-key"
```

Replace the example secrets with your own values. Never commit `.env` to GitHub.

### Database Setup

Start PostgreSQL and create the `chirpy` database if it doesn't already exist.

Generate and apply migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Run the Server

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:8080
```

## API Endpoints

### Users

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users` | Register a user |
| PUT | `/api/users` | Update user details |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Log in |
| POST | `/api/refresh` | Refresh access token |
| POST | `/api/revoke` | Revoke refresh token |

### Chirps

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chirps` | Create a chirp |
| GET | `/api/chirps` | Retrieve all chirps |
| GET | `/api/chirps/:chirpId` | Retrieve a specific chirp |
| DELETE | `/api/chirps/:chirpId` | Delete a chirp |

The chirps endpoint supports optional query parameters:

- `authorId`: Filter chirps by author.
- `sort`: Sort by creation date using `asc` or `desc`. Defaults to `asc`.

Examples:

```text
GET /api/chirps?sort=desc
GET /api/chirps?authorId=USER_ID
GET /api/chirps?authorId=USER_ID&sort=desc
```

### Webhooks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/polka/webhooks` | Handle Polka membership upgrade events |

The webhook uses API key authentication to verify incoming requests.

### Administration and Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/healthz` | Check server health |
| GET | `/admin/metrics` | View server metrics |
| POST | `/admin/reset` | Reset development metrics and users |

**Note:** Administrative endpoints should only be used in the appropriate development environment.

## Testing

Run the test suite:

```bash
npm run test
```

Check TypeScript for errors:

```bash
npx tsc --noEmit
```

Run Boot.dev assignment tests:

```bash
bootdev run -s
```

## Project Structure

```text
http_server/
├── src/
│   ├── api/
│   │   ├── chirps.ts
│   │   ├── login.ts
│   │   ├── users.ts
│   │   ├── refresh.ts
│   │   ├── revoke.ts
│   │   ├── polka.ts
│   │   ├── readiness.ts
│   │   ├── metrics.ts
│   │   └── reset.ts
│   ├── db/
│   │   ├── queries/
│   │   ├── migrations/
│   │   ├── schema.ts
│   │   ├── index.ts
│   │   └── migrate.ts
│   ├── app/
│   ├── auth.ts
│   ├── config.ts
│   ├── errors.ts
│   ├── middleware.ts
│   └── index.ts
├── .env
├── .gitignore
├── drizzle.config.ts
├── package.json
└── README.md
```

## Learning Objectives

Through this project, I practiced:

- Building REST APIs with Express
- Working with TypeScript
- Connecting applications to PostgreSQL
- Managing database schemas and migrations
- Implementing JWT authentication
- Handling HTTP requests and responses
- Writing database queries with Drizzle ORM
- Building secure and idempotent webhooks
- Filtering and sorting API results
- Handling errors and middleware

## Acknowledgements

Built as part of the [Boot.dev](https://www.boot.dev/) backend development curriculum.

