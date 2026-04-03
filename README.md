# Checkit Engineering - Backend Assessment

This repository contains a robust, microservice-based backend architecture consisting of a **User Service** and a **Wallet Service**. The services are built with **NestJS**, utilize **gRPC** for high-performance internal communication, and use **Prisma ORM** with a **PostgreSQL** database (Supabase).

### 🏛️ Architecture & Deployment Note
> These microservices are built using gRPC for high-performance, internal communication and have been successfully deployed to Render to demonstrate cloud readiness. However, because standard PaaS public load balancers perform TLS termination and downgrade HTTP/2 traffic to HTTP/1.1, the raw gRPC endpoints cannot be accessed directly via the public internet using tools like Postman. 
> 
> In a true production environment, these would be deployed as Private Services behind a public-facing API Gateway. **To test the core logic, transaction safety, and database integration, please clone the repository and run the services locally.**

---

## ⚙️ Project Setup Instructions

### Prerequisites
* Node.js (v18 or higher recommended)
* npm
* A PostgreSQL database string (Supabase recommended)
* Postman (for testing gRPC endpoints)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Bamidele123456/Checkit-Engineering.git
cd Checkit-Engineering
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a `.env` file in the root directory and add your database connection strings. Ensure special characters in passwords are URL-encoded.
\`\`\`env
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
\`\`\`

---

## 🗄️ How to Run Migrations

Before starting the services, you must sync the Prisma schema with your database and generate the Prisma Client. Run the following commands in the root directory:

**1. Generate the Prisma Client:**
\`\`\`bash
npx prisma generate --schema=./packages/prisma/schema.prisma
\`\`\`

**2. Push the tables to the database:**
\`\`\`bash
npx prisma db push --schema=./packages/prisma/schema.prisma
\`\`\`
*(Note: `db push` is used for prototyping. In a CI/CD production environment, `prisma migrate deploy` would be utilized).*

---

## 🚀 How to Run Services

Because this is a microservice architecture, you will need to compile the TypeScript code and start both services independently. 

**1. Build the applications:**
\`\`\`bash
npm run build user-service
npm run build wallet-service
\`\`\`

**2. Copy the gRPC Dictionary:**
The compiled JavaScript needs access to the `.proto` definitions. Run the following command to copy the files into the `dist` folder:
* **Windows (PowerShell):** `Copy-Item -Path packages -Destination dist -Recurse`
* **Mac/Linux:** `cp -r packages dist/`

**3. Start the Services:**
Open two separate terminals in the root directory:

*Terminal 1 (User Service - Port 50051):*
\`\`\`bash
node dist/user-service/src/main.js
\`\`\`

*Terminal 2 (Wallet Service - Port 50052):*
\`\`\`bash
node dist/wallet-service/src/main.js
\`\`\`

---

## 🧪 Example Requests (Postman gRPC)

To test the APIs, open Postman, create a **gRPC Request**, and import the `user.proto` file into your Postman API workspace. 

Ensure **Server Certificate Verification (TLS)** is turned **OFF** for local testing.

### 1. Create a User (UserService)
* **URL:** `localhost:50051`
* **Method:** `UserService / CreateUser`
* **Message Payload:**
\`\`\`json
{
  "email": "test@example.com",
  "name": "John Doe"
}
\`\`\`
*(Returns the new User object including the ID. Uses a try/catch block to return a clean `ALREADY_EXISTS` constraint error if the email is taken).*

### 2. Create a Wallet (WalletService)
* **URL:** `localhost:50052`
* **Method:** `WalletService / CreateWallet`
* **Message Payload:**
\`\`\`json
{
  "userId": "PASTE_USER_ID_HERE"
}
\`\`\`
*(Initializes a wallet with a balance of 0).*

### 3. Debit Wallet (WalletService)
* **URL:** `localhost:50052`
* **Method:** `WalletService / DebitWallet`
* **Message Payload:**
\`\`\`json
{
  "userId": "PASTE_USER_ID_HERE",
  "amount": 50.00
}
\`\`\`
*(Uses an interactive Prisma Transaction to ensure race conditions do not occur. It will securely reject the transaction with a `FAILED_PRECONDITION` error if the wallet lacks sufficient funds).*