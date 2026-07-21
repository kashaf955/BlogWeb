# Blogweb

A simple full-stack blog app built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **EJS**. Users can sign up, sign in, create blogs with cover images, and comment on posts.

## Features

- User signup / signin with JWT cookie authentication
- Create blogs with title, body, and cover image upload
- Home page listing of all blogs
- Individual blog pages with author info and comments
- Responsive UI (Bootstrap + custom CSS)

## Tech stack

| Layer | Technology |
|-------|------------|
| Server | Express 5 |
| Views | EJS |
| Database | MongoDB + Mongoose |
| Auth | JWT + cookies |
| Uploads | Multer |

## Project structure

```
Blog/
├── app.js                 # App entry point
├── middlewares/           # Auth cookie middleware
├── models/                # User, Blog, Comment schemas
├── routes/                # /user and /blogs routes
├── services/              # JWT helpers
├── views/                 # EJS templates
├── public/                # Static files (css, images, uploads)
└── .env                   # Environment variables (not committed)
```

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB locally **or** a MongoDB Atlas cluster

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
JWT_SECRET=your-long-random-secret
PORT=8000
mongo_uri=mongodb://127.0.0.1:27017/Blogweb
```

For MongoDB Atlas, use your connection string and keep the database name casing consistent (e.g. `Blogweb`):

```env
mongo_uri=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/Blogweb
```

3. Start the app:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

4. Open [http://localhost:8000](http://localhost:8000)

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `mongo_uri` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign/verify JWT tokens |
| `PORT` | No | Server port (default `8000`; Render sets this automatically) |
| `CLOUDINARY_CLOUD_NAME` | Yes (production) | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes (production) | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes (production) | Cloudinary API secret |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run the server with Node |
| `npm run dev` | Run with Nodemon (auto-restart) |

## Main routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Home — list all blogs |
| `GET` | `/user/signup` | Signup page |
| `POST` | `/user/signup` | Create account |
| `GET` | `/user/signin` | Signin page |
| `POST` | `/user/signin` | Log in |
| `GET` | `/user/logout` | Log out |
| `GET` | `/blogs/add-new` | Add blog form (auth) |
| `POST` | `/blogs` | Create blog with image (auth) |
| `GET` | `/blogs/:id` | View a single blog |
| `POST` | `/blogs/comments/:blogId` | Add a comment (auth) |

## Deploy on Render

1. Push the project to GitHub.
2. Create a new **Web Service** on Render and connect the repo.
3. Settings:
   - **Root Directory:** leave empty if this folder is the repo root
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables in Render:
   - `mongo_uri` — Atlas connection string (use the same DB name casing as in Atlas)
   - `JWT_SECRET` — a strong secret
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your [Cloudinary](https://cloudinary.com) dashboard
5. Deploy.

> Cover images are uploaded to **Cloudinary** when those env vars are set (recommended for Render). Without them, files go to `public/uploads/` on the server disk, which does **not** persist on Render.

## License

ISC
