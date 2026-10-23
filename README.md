# iMovies — Movie Ticket Booking

A full-stack React + Vite frontend and Node.js + Express + MongoDB backend.

## Before you start (Mac)

1. Install **Node.js LTS** from https://nodejs.org/en/download (choose the macOS Installer `.pkg`).
2. Install and start MongoDB locally, or create a MongoDB Atlas database.
3. Open Terminal and enter the project folder.

Check Node.js and npm:

```bash
node -v
npm -v
```

## 1. Configure the backend

In Terminal:

```bash
cd server
cp .env.example .env
npm install
```

Open `server/.env` in a text editor. For a local MongoDB installation, the default `MONGO_URI=mongodb://127.0.0.1:27017/imovies` can be used. If using MongoDB Atlas, replace it with your Atlas connection string. Change `JWT_SECRET` to a long random value before using the app beyond local testing.

Seed sample movies, theatre, shows, and the development admin account:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

Leave this Terminal window running. The API uses `http://localhost:5000`.

## 2. Start the frontend

Open a **second Terminal window**. From the project folder, run:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## Folder structure

- `client/` — React frontend, pages, components, styles, and Vite configuration.
- `server/` — Express API, routes, controllers, MongoDB models, middleware, and seed script.
- `server/.env.example` — sample configuration; copy this to `server/.env` for local use.

## Important notes

- Do not upload `server/.env` or real secrets to GitHub.
- MongoDB must be running and reachable before the backend starts.
- Payment-related screens in this educational project are not proof of a real payment gateway integration. Configure and test a legitimate payment provider before accepting payments.
- The sample admin credentials in `server/.env.example` are for local development only. Change them before any public deployment.
