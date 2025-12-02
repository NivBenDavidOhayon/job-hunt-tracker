// server/routes/jobsRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const jobController = require('../controllers/jobController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', jobController.getJobs);
router.post('/', jobController.createJob);

module.exports = router;

