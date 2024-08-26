const express = require('express');
const router = express.Router();

const {
    createJob,
    deleteJob,
    getAllJobs,
    updateJob,
    showStats,
} = require('../controller/jobsController');
const authenticatedUser = require('../midllewares/auth');
const strictTestUser = require('../midllewares/strictTestUser');

router.get('/stats', authenticatedUser, showStats);
router.get('/', authenticatedUser, getAllJobs);
router.post('/', authenticatedUser, strictTestUser, createJob);
router.patch('/:id', authenticatedUser, strictTestUser, updateJob);
router.delete('/:id', authenticatedUser, strictTestUser, deleteJob);

// router
//     .route('/:id')
//     .patch(authenticatedUser, strictTestUser, updateJob)
//     .delete(authenticatedUser, strictTestUser, deleteJob);

module.exports = router;
