// server/controllers/jobController.js
const {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
} = require('../services/jobService');

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

async function deleteJobController(req, res) {
  const jobId = parseInt(req.params.id, 10);

  if (Number.isNaN(jobId)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  try {
    const deletedCount = await deleteJob(req.user.email, jobId);

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateJobController(req, res) {
  const jobId = parseInt(req.params.id, 10);

  if (Number.isNaN(jobId)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  try {
    const updatedJob = await updateJob(req.user.email, jobId, req.body);

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(updatedJob);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getJobs: getJobsController,
  createJob: createJobController,
  deleteJob: deleteJobController,
  updateJob: updateJobController,
};

