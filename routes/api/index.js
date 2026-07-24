const { Router } = require('express');
const authRoutes = require('./auth');
const blogRoutes = require('./blogs');
const commentRoutes = require('./comments');

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    message: 'Blogweb REST API',
    auth: 'JWT cookie (token)',
    resources: ['auth', 'blogs', 'comments'],
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me',
      },
      blogs: {
        list: 'GET /api/blogs',
        get: 'GET /api/blogs/:id',
        create: 'POST /api/blogs',
        update: 'PUT /api/blogs/:id',
        delete: 'DELETE /api/blogs/:id',
      },
      comments: {
        list: 'GET /api/comments?blogId=',
        get: 'GET /api/comments/:id',
        create: 'POST /api/comments',
        update: 'PUT /api/comments/:id',
        delete: 'DELETE /api/comments/:id',
      },
    },
  });
});

router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
