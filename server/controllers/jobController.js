// server/controllers/jobController.js
const { getJobs, createJob } = require('../services/jobService');

async function getJobsController(req, res) {
  try {
    const jobs = await getJobs(req.user.email);
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function createJobController(req, res) {
  try {
    const job = await createJob(req.user.email, req.body);
    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getJobs: getJobsController,
  createJob: createJobController,
};

