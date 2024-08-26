//if you are using module use import and declare it n package.json type:"module"
// import express from "express";

// if you are use commonjs use require
const express = require('express');
require('dotenv').config();
var cors = require('cors');

const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const { rateLimit } = require('express-rate-limit');

const { dirname } = require('path');
const { fileURLToPath } = require('url');
const path = require('path');
const connectDB = require('./db/connect');

//middlewares
const { notFoundMiddleware } = require('./midllewares/not-found');
const { errorHandler } = require('./midllewares/error-handler');
require('express-async-errors');
const morgan = require('morgan');

const app = express();
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

const __dirName = dirname(
    fileURLToPath(require('url').pathToFileURL(__filename).toString())
);
app.use(express.static(path.resolve(__dirName, './client/dist')));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 2000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message:
        'Too many requests from this IP, please try again after 15 minutes.',
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});

// Apply the rate limiting middleware to all requests.
//parsing to JSON
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(limiter);

//Routes
const authRoutes = require('./routes/authRoutes');
const jobsRoutes = require('./routes/jobsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirName, './client/dist', 'index.html'));
});
app.use(notFoundMiddleware);

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server running in ${port}......`);
});
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
    } catch (err) {
        console.log(err.message);
    }
};
start();
