# Clerk Authentication Integration

A full-stack application demonstrating integration of Clerk authentication with a custom database backend.

## Live Demo

Check out the live demo: [https://clerk-omega-lake.vercel.app/](https://clerk-omega-lake.vercel.app/)

(Vercel on frontend and render.com on backend)

## Setup Instructions

### Prerequisites

- Node.js and npm
- Clerk account (https://clerk.dev)
- Neon.tech account (serverless postgres)

### Setup

1. Navigate to the root directory:

   ```
   npm install
   ```

2. Create `.env` file with the following variables:

```
DATABASE_URL=
PORT=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

3. Navigate to the backend directory:

   ```
   cd apps/backend
   ```

4. Install dependencies:

   ```
   npm install
   ```

5. Navigate to the frontend directory:

   ```
   cd apps/frontend
   ```

6. Install dependencies:

   ```
   npm install
   ```

7. Create `.env` file with the following variables:

   ```
   VITE_CLERK_PUBLISHABLE_KEY
   VITE_API_URL
   ```

8. Start the development servers (from the root folder), it starts frontend and backend:
   ```
   npm start
   ```

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Register a new account with the signup form
3. Log in with your credentials
4. Try the password reset functionality

## License

MIT
