const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('landing', {
        user: req.user
    });
});

function authRequired(req, res, next) {
    // console.log("auth required", req.user)
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/home', authRequired, (req, res) => {
    // console.log('the user?', req.user);
    res.render('home', {
        user: req.user,
        username: req.user.username,
        title: 'Home'
    });
})
module.exports = router;