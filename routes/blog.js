const {Router} = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Blog = require('../models/blog');
const Comment = require('../models/comments');

const router = Router();

const uploadDir = path.resolve('public', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});
const upload = multer({ storage: storage });



router.get('/add-new', (req, res) => {
    return res.render('addBlog' ,{
        user: req.user,
    });
});

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    return res.render('blog', {
    user: req.user,
    blog,
    });
});

router.post('/comments/:blogId', async (req, res) => {
  if (!req.user) {
    return res.redirect('/user/signin');
  }

  const commentText = (req.body?.comment || req.body?.content || '').trim();

  if (!commentText) {
    return res.status(400).send('Comment cannot be empty.');
  }

  await Comment.create({
    body: commentText,
    blogId: req.params.blogId,
    createdBy: req.user._id || req.user.id,
  });
  return res.redirect(`/blogs/${req.params.blogId}`);
});

router.post('/', upload.single('coverImage'), async (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }

    const title = req.body?.title?.trim();
    const body = req.body?.body?.trim();

    if (!title || !body) {
        return res.status(400).send('Title and body are required.');
    }

    const blog = await Blog.create({
        title,
        body,
        coverImageURL: req.file ? `/uploads/${req.file.filename}` : null,
        createdBy: req.user._id || req.user.id,
    });
    return res.redirect(`/blogs/${blog._id}`);
});

module.exports = router;