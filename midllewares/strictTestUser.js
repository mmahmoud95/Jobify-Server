const { BadRequestError } = require('../errors');

const jwt = require('jsonwebtoken');

const strictTestUser = async (req, res, next) => {
    if (req.userId === '66c557c12688374a25a3e0e6') {
        throw new BadRequestError('Test User, Read Only!');
    }
    next();
};

module.exports = strictTestUser;
