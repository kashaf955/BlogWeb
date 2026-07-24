const { Router } = require('express');
const Comment = require('../../models/comments');
const Blog = require('../../models/blog');
const { requireAuth } = require('../../middlewares/authentication');

const router = Router();

function isOwner(comment, user) {
  if (!comment?.createdBy || !user) return false;
  return String(comment.createdBy._id || comment.createdBy) === String(user._id || user.id);
}

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.blogId) {
      filter.blogId = req.query.blogId;
    }

    const comments = await Comment.find(filter)
      .populate('createdBy', 'fullName email profileImageURL')
      .populate('blogId', 'title')
      .sort({ createdAt: -1 });

    return res.json({ comments });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('createdBy', 'fullName email profileImageURL')
      .populate('blogId', 'title');

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    return res.json({ comment });
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = (req.body?.body || req.body?.comment || '').trim();
    const blogId = req.body?.blogId;

    if (!body || !blogId) {
      return res.status(400).json({ error: 'blogId and body are required' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const comment = await Comment.create({
      body,
      blogId,
      createdBy: req.user._id || req.user.id,
    });

    return res.status(201).json({ message: 'Comment created', comment });
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (!isOwner(comment, req.user)) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    const body = (req.body?.body || req.body?.comment || '').trim();
    if (!body) {
      return res.status(400).json({ error: 'body is required' });
    }

    comment.body = body;
    await comment.save();
    return res.json({ message: 'Comment updated', comment });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (!isOwner(comment, req.user)) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Comment deleted' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
