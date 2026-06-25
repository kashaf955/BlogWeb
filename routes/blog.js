const {Router} = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Blog = require('../models/blog');
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

router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
   const blog = await Blog.create({
        title,
        body,
        coverImageURL: req.file ? `/uploads/${req.file.filename}` : null,
        createdBy: req.user._id,
    });
   return res.redirect(`/blogs/${blog._id}`);
});

module.exports = router;