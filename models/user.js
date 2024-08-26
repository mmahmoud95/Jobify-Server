const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'please provide a valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 8,
        // select: false,
    },
    lastName: {
        type: String,
        maxlength: 20,
        trim: true,
        default: 'lastName',
    },
    location: {
        type: String,
        maxlength: 20,
        trim: true,
        default: 'my city',
    },
});

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = bcrypt.genSaltSync(10);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password = hashed;
});

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
};
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};
const userModel = mongoose.model('User', UserSchema);

module.exports = { userModel };
