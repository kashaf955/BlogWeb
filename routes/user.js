const {Router} = require('express');
const User = require('../models/user');

const router = Router();

router.get('/signin', (req, res) => {
   return res.render('signin');
});

router.get('/signup', (req, res) => {
   return res.render('signup');
});

router.post('/signup', async (req, res) => {
    const {fullName, email, password} = req.body;
    await User.create({fullName, email, password});
    res.redirect('/');
});

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    let token;
    try {
        token = await User.matchPasswordAndCreateToken(email, password);
    } catch (error) {
        return res.render('signin', {error: 'Incorrect email or password'});
    }

    return res.cookie('token', token).redirect('/');
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
});

module.exports = router;