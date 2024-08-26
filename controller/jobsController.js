const { BadRequestError, NotFoundError } = require('../errors');
const { jobModel } = require('../models/job');
const { StatusCodes } = require('http-status-codes');
const checkPermissions = require('../utils/checkPermissions');
const mongoose = require('mongoose');
const moment = require('moment');
const {
    Types: { ObjectId },
} = mongoose;
const createJob = async (req, res) => {
    const { company, position } = req.body;
    if (!company || !position) {
        throw new BadRequestError('please provide a company and position');
    }
    req.body.createdBy = req.userId;
    const job = await jobModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};
const getAllJobs = async (req, res) => {
    const { status, jobType, search, sort } = req.query;
    const queryObject = { createdBy: req.userId };
    if (status && status !== 'all') {
        queryObject.status = status;
    }
    if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType;
    }
    if (search) {
        queryObject.position = { $regex: search, $options: 'i' };
    }
    let result = jobModel.find(queryObject);
    ///sorting conditions
    if (sort === 'latest') {
        result = result.sort('-createdAt');
    }
    if (sort === 'oldest') {
        result = result.sort('createdAt');
    }
    if (sort === 'a-z') {
        result = result.sort('position');
    }
    if (sort === 'z-a') {
        result = result.sort('-position');
    }
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const jobs = await result;
    console.log(queryObject);
    const totalJobs = await jobModel.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalJobs / limit);
    res.status(StatusCodes.OK).json({
        jobs,
        totalJobs,
        numberOfPages,
    });
};
const updateJob = async (req, res) => {
    const { company, position } = req.body;
    const { id: jobId } = req.params;
    if (!company || !position) {
        throw new BadRequestError('please provide a company and position');
    }

    const job = await jobModel.findOne({ _id: jobId });
    if (!job) {
        throw new NotFoundError(`No job found for ${jobId}`);
    }

    checkPermissions(req.userId, job.createdBy);
    const updatedJob = await jobModel.findOneAndUpdate(
        { _id: jobId },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(StatusCodes.OK).json({
        updatedJob,
    });
};
const deleteJob = async (req, res) => {
    const { id: jobId } = req.params;
    const job = await jobModel.findOne({ _id: jobId });
    if (!job) {
        throw new NotFoundError(`No job found for ${jobId}`);
    }
    checkPermissions(req.userId, job.createdBy);
    await jobModel.findOneAndDelete({ _id: jobId });

    // await job.remove();
    res.status(StatusCodes.OK).json({ message: `you job delet successfully` });
};

const showStats = async (req, res) => {
    let stats = await jobModel.aggregate([
        { $match: { createdBy: new ObjectId(req.userId) } },
        // { $match: { createdBy: new mongoose.Types.ObjectId(req.userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr;
        acc[title] = count;
        return acc;
    }, {});

    let defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
    };
    let monthlyApplications = await jobModel.aggregate([
        { $match: { createdBy: new ObjectId(req.userId) } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
    ]);

    monthlyApplications = monthlyApplications
        .map((item) => {
            const {
                _id: { year, month },
                count,
            } = item;
            const date = moment()
                .month(month - 1)
                .year(year)
                .format('MMM Y');
            return { date, count };
        })
        .reverse();
    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
module.exports = { createJob, deleteJob, getAllJobs, updateJob, showStats };
