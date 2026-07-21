require('dotenv').config();


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');
require('./models/user');

const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');


const app = express();
const port = process.env.PORT || 8000;
const mongoUri = process.env.mongo_uri || 'mongodb://127.0.0.1:27017/Blogweb';

mongoose.connect(mongoUri).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error.message);
});

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    res.render('home', { user: req.user, blogs: allBlogs });
  } catch (error) {
    console.error('Home error:', error);
    res.status(500).send(`Failed to load home: ${error.message}`);
  }
});


app.use('/user', userRoutes);
app.use('/blogs', blogRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send(`Internal server error: ${err.message}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
