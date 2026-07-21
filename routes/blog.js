const {Router} = require('express');

const Blog = require('../models/blog');
const Comment = require('../models/comments');
const { upload, getCoverImageURL } = require('../services/upload');

const router = Router();

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
        coverImageURL: getCoverImageURL(req.file),
        createdBy: req.user._id || req.user.id,
    });
    return res.redirect(`/blogs/${blog._id}`);
});

module.exports = router;
