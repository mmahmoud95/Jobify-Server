const { userModel } = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const {
    BadRequestError,
    NotFoundError,
    UnAuthenticatedError,
} = require('../errors/index');

const { attachCookie } = require('../utils/attachCookie');
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new BadRequestError('Please provide all values');
    }
    const userAlreadyExist = await userModel.findOne({ email });
    if (userAlreadyExist) {
        throw new BadRequestError('email already in use');
    }
    const user = await userModel.create({
        name,
        email,
        password,
    });

    const token = user.createJWT();
    attachCookie(res, token);
    res.status(StatusCodes.CREATED).json({
        user: {
            name: user.name,
            email: user.email,
            location: user.location,
            lastName: user.lastName,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('please provide all values');
    }
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        throw new UnAuthenticatedError('password or email is incorrect');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError('password or email is incorrect');
    }

    const token = user.createJWT();
    user.password = undefined;
    attachCookie(res, token);
    console.log(user);
    res.status(StatusCodes.OK).json({ user, location: user.location });
};
const update = async (req, res) => {
    if (req.userId === '664bd8f0f9c5ad0a5b05f8dd') {
        throw new BadRequestError('you are not allowed to create a job');
    }
    const { email, name, location, lastName } = req.body;
    if (!email || !name || !location || !lastName) {
        throw new BadRequestError('Please provide all values');
    }

    const user = await userModel.findOne({ _id: req.userId });
    console.log(user);
    user.name = name;
    user.lastName = lastName;
    user.email = email;
    user.location = location;

    await user.save();
    const token = user.createJWT();
    attachCookie(res, token);
    res.status(StatusCodes.OK).json({ user, location: user.location });
};

const getCurrentUser = async (req, res) => {
    const user = await userModel.findOne({ _id: req.userId });
    user.password = undefined;
    res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logOut = async (req, res) => {
    res.cookie('token', 'any', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged Out' });
};
module.exports = { register, login, update, getCurrentUser, logOut };
