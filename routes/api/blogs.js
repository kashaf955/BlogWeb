const { Router } = require('express');
const Blog = require('../../models/blog');
const Comment = require('../../models/comments');
const { requireAuth } = require('../../middlewares/authentication');

const router = Router();

function isOwner(blog, user) {
  if (!blog?.createdBy || !user) return false;
  return String(blog.createdBy._id || blog.createdBy) === String(user._id || user.id);
}

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({})
      .populate('createdBy', 'fullName email profileImageURL')
      .sort({ createdAt: -1 });
    return res.json({ blogs });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      'createdBy',
      'fullName email profileImageURL'
    );
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    return res.json({ blog });
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const title = req.body?.title?.trim();
    const body = req.body?.body?.trim();
    const coverImageURL = req.body?.coverImageURL || null;

    if (!title || !body) {
      return res.status(400).json({ error: 'title and body are required' });
    }

    const blog = await Blog.create({
      title,
      body,
      coverImageURL,
      createdBy: req.user._id || req.user.id,
    });

    return res.status(201).json({ message: 'Blog created', blog });
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    if (!isOwner(blog, req.user)) {
      return res.status(403).json({ error: 'You can only edit your own blogs' });
    }

    const title = req.body?.title?.trim();
    const body = req.body?.body?.trim();
    if (!title || !body) {
      return res.status(400).json({ error: 'title and body are required' });
    }

    blog.title = title;
    blog.body = body;
    if (req.body.coverImageURL !== undefined) {
      blog.coverImageURL = req.body.coverImageURL || null;
    }

    await blog.save();
    return res.json({ message: 'Blog updated', blog });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    if (!isOwner(blog, req.user)) {
      return res.status(403).json({ error: 'You can only delete your own blogs' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ blogId: req.params.id });
    return res.json({ message: 'Blog deleted' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
