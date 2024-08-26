const express = require('express');

const router = express.Router();
const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 15 requests per `window` (here, per 15 minutes).
    message:
        'Too many requests from this IP, please try again after 15 minutes.',
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});

const {
    register,
    login,
    update,
    getCurrentUser,
    logOut,
} = require('../controller/authController');
const authenticatedUser = require('../midllewares/auth');
const strictTestUser = require('../midllewares/strictTestUser');

router.post('/register', limiter, register);
// router.route('/register').post(register);
router.post('/login', limiter, login);
router.patch('/update', authenticatedUser, strictTestUser, update);
router.get('/getCurrentUser', authenticatedUser, getCurrentUser);
router.post('/logout', logOut);

module.exports = router;
