const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const {
    check,
    validationResult
} = require('express-validator');

router.get('/login', (req, res) => {
    let error = req.flash('error').toString();
    if (error) {
        res.render('login', {
            showErrors: true,
            message: error
        });
    } else {
        res.render('login'), {
            showErrors: false
        };
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', (req, res) => {

    res.render('register');

});

router.post('/register',
    [
        check('username', "Username required.").not().isEmpty(),
        check('password', 'Passwords do not match.').not().equals('confirmpassword'),
        check('email', 'Not a valid email').isEmail()
    ],
    async (req, res, next) => {
            const errors = validationResult(req);
            console.log('Errors', errors.array());
            if (!errors.isEmpty()) {
                res.render('register', {
                    showErrors: true,
                    error: errors.array()
                })
            } else {
                // create user object and save into mongodb
                const user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                });
                await user.save((err) => {
                    if (err) {
                        res.render('register', {
                            showErrors: true,
                            error: [{
                                msg: 'Username or Email already in use.'
                            }]
                        });
                        console.log('There was an error saving the user.', err);
                    } else {
                        next();
                    }
                });
            }
        },
        passport.authenticate('local', {
            successRedirect: '/home'
        }));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});
module.exports = router;