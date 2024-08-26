// const { default: mongoose } = require('mongoose');
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Please provide a company name'],
            maxlength: 50,
        },
        position: {
            type: String,
            required: [true, 'Please provide a position'],
            maxlength: 100,
        },
        jobLocation: {
            type: String,
            required: [true, 'Please provide a position'],
            maxlength: 100,
        },
        status: {
            type: String,
            enum: ['interview', 'declined', 'pending'],
            default: 'pending',
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'remote', 'internship'],
            default: 'full-time',
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'please provide user'],
        },
    },
    { timestamps: true }
);

const jobModel = mongoose.model('Job', JobSchema);
module.exports = { jobModel };
