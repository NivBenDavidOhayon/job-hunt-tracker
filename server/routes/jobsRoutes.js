// server/routes/jobsRoutes.js
const express = require('express');
const {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getJobs);
router.post('/', createJob);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;

