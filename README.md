# Blogweb

A full-stack blog app with a **CRUD REST API** (JSON) plus an EJS UI. Auth uses **JWT in cookies** .



- CRUD REST API with Express (`/api/blogs`, `/api/comments`)
- Mongoose schemas/models (`User`, `Blog`, `Comment`)
- JWT-based auth (register + login) via **httpOnly cookie**
- Middleware for auth and API error handling

## Features

- REST API with JWT **cookie** auth
- EJS UI: signup/signin, create/edit/delete blogs, comments
- Cover images via Cloudinary (recommended for production)
- Responsive UI (Bootstrap + custom CSS)

## Tech stack

| Layer | Technology |
|-------|------------|
| Server | Express 5 |
| API | JSON REST (`/api`) |
| Views | EJS |
| Database | MongoDB + Mongoose |
| Auth | JWT cookie (`token`) |
| Uploads | Multer + Cloudinary |

## Setup

```bash
npm install
```

`.env`:

```env
JWT_SECRET=your-long-random-secret
PORT=8000
mongo_uri=mongodb://127.0.0.1:27017/Blogweb
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

- UI: http://localhost:8000  
- API: http://localhost:8000/api  

## REST API (cookie auth)

Login/register sets an httpOnly cookie named `token`.  
Protected routes use that cookie automatically — **no `Authorization: Bearer` header**.

In Postman: enable **Cookies** / send requests in the same session after login.

### Auth

| Method | Path | Body |
|--------|------|------|
| `POST` | `/api/auth/register` | `{ "fullName", "email", "password" }` |
| `POST` | `/api/auth/login` | `{ "email", "password" }` |
| `POST` | `/api/auth/logout` | — |
| `GET` | `/api/auth/me` | — (cookie required) |

### Blogs

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/api/blogs` | No |
| `GET` | `/api/blogs/:id` | No |
| `POST` | `/api/blogs` | Cookie |
| `PUT` | `/api/blogs/:id` | Cookie (owner) |
| `DELETE` | `/api/blogs/:id` | Cookie (owner) |

Body for create/update: `{ "title", "body", "coverImageURL?" }`

### Comments

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/api/comments?blogId=` | No |
| `GET` | `/api/comments/:id` | No |
| `POST` | `/api/comments` | Cookie |
| `PUT` | `/api/comments/:id` | Cookie (owner) |
| `DELETE` | `/api/comments/:id` | Cookie (owner) |

Body for create: `{ "blogId", "body" }`


## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `mongo_uri` | Yes | MongoDB URI |
| `JWT_SECRET` | Yes | JWT secret |
| `PORT` | No | Default `8000` |
| `CLOUDINARY_*` | Production | Image uploads for UI |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run server |
| `npm run dev` | Nodemon |

## License

ISC
