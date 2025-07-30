# Alt Mobility Backend Project

This project is a full-stack backend application built with Node.js, Express.js, PostgreSQL, and Prisma ORM. It includes modules for authentication, lead and customer management, a referral system, a wallet system, and an admin dashboard.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Features

- **Authentication**: User login via phone/email + OTP (simulated), role-based access control (ADMIN, CUSTOMER), JWT-based sessions.
- **Leads Management**: Add new leads, retrieve all leads, convert leads to customers.
- **Customer Management**: View all customers, automatic creation of scheduled EMI entries upon customer creation, EMI payments via Razorpay test API.
- **Referral System**: One-time referral codes for customers, referral tracking, referral payouts to referrer wallets.
- **Wallet System**: Individual customer wallets, transaction logging, simulated payments via Razorpay.
- **Admin Dashboard**: View all leads, customers, vehicles, referral analytics, all actions controlled by role-based middleware.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- TypeScript
- Jest (for testing)
- Docker (for PostgreSQL)

## Project Structure

The project follows a function-based modular structure:

```
src/
├── admin/
│   ├── controllers/
│   ├── repositories/
│   ├── routes/
│   └── services/
├── auth/
│   ├── controllers/
│   ├── repositories/
│   ├── routes/
│   └── services/
├── customers/
│   ├── controllers/
│   ├── repositories/
│   ├── routes/
│   └── services/
├── leads/
│   ├── controllers/
│   ├── repositories/
│   ├── routes/
│   └── services/
├── middleware/
├── payments/
│   ├── controllers/
│   ├── repositories/
│   ├── routes/
│   └── services/
├── referral/
│   ├── controllers/
│   ├── repositories/
│   ├── routes/
│   └── services/
├── __tests__/
└── index.ts
```

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd alt-mobility-backend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Set up PostgreSQL with Docker:**
    Ensure Docker is installed and running on your system.
    ```bash
    docker run --name alt-mobility-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the project root and add the following:
    ```
    DATABASE_URL="postgresql://postgres:password@localhost:5432/alt_mobility_db?schema=public"
    JWT_SECRET="supersecretjwtkey" # Change this to a strong, random secret in production
    ```

5.  **Run Prisma Migrations:**
    ```bash
    npx prisma migrate dev --name init
    ```

## Running the Application

To run the application in development mode (with `ts-node`):

```bash
npm run dev
```

To build and run the application in production mode:

```bash
npm run build
npm run start
```

## API Endpoints

(To be filled with detailed API documentation, including request/response examples for each endpoint.)

## Testing

To run tests:

```bash
npm test
```

To run specific tests (e.g., authentication tests):

```bash
npm test src/__tests__/auth.test.ts
```


