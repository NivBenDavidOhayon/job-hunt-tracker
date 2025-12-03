// server/routes/jobsRoutes.js
const express = require('express');
const { getJobs, createJob } = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getJobs);
router.post('/', createJob);

module.exports = router;

