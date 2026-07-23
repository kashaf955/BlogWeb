# Blogweb

A full-stack blog app built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **EJS**. Users can sign up, sign in, create, edit, and delete blogs with cover images, and comment on posts.

## Features

- User signup / signin with JWT cookie authentication
- Create blogs with title, body, and cover image upload
- Edit and delete your own blogs
- Home page listing of all blogs
- Individual blog pages with author info and comments
- Cover images stored on **Cloudinary** (recommended for production)
- Responsive UI (Bootstrap + custom CSS)

## Tech stack

| Layer | Technology |
|-------|------------|
| Server | Express 5 |
| Views | EJS |
| Database | MongoDB + Mongoose |
| Auth | JWT + cookies |
| Uploads | Multer + Cloudinary |

## Project structure

```
Blog/
├── app.js                 # App entry point
├── middlewares/           # Auth cookie middleware
├── models/                # User, Blog, Comment schemas
├── routes/                # /user and /blogs routes
├── services/              # JWT + upload helpers
├── views/                 # EJS templates
├── public/                # Static files (css, images, uploads)
└── .env                   # Environment variables (not committed)
```

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB locally **or** a MongoDB Atlas cluster
- Cloudinary account (for production image uploads)

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
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
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

Without Cloudinary env vars, images are saved locally under `public/uploads/` (fine for local development; not reliable on Render).

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run the server with Node |
| `npm run dev` | Run with Nodemon (auto-restart) |

## Main routes

### Auth

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/user/signup` | Signup page |
| `POST` | `/user/signup` | Create account |
| `GET` | `/user/signin` | Signin page |
| `POST` | `/user/signin` | Log in |
| `GET` | `/user/logout` | Log out |

### Blogs

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Home — list all blogs |
| `GET` | `/blogs/add-new` | Add blog form (auth) |
| `POST` | `/blogs` | Create blog with image (auth) |
| `GET` | `/blogs/:id` | View a single blog |
| `GET` | `/blogs/:id/edit` | Edit blog form (owner only) |
| `POST` | `/blogs/:id/edit` | Update blog (owner only) |
| `DELETE` | `/blogs/:id` | Delete blog (owner only) |
| `POST` | `/blogs/comments/:blogId` | Add a comment (auth) |


## License

ISC
