// server/controllers/jobController.js
const jobService = require('../services/jobService');

async function getJobs(req, res) {
  try {
    const jobs = await jobService.getJobs(req.user.email);
    res.json(jobs);
  } catch (err) {
    console.error('Get jobs error:', err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
}

async function createJob(req, res) {
  try {
    const job = await jobService.createJob(req.user.email, req.body);
    res.status(201).json(job);
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ message: 'Failed to create job' });
  }
}

module.exports = {
  getJobs,
  createJob,
};

