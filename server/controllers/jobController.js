// server/controllers/jobController.js
const supabase = require('../supabaseClient');
const {
  getJobs: getJobsService,
  createJob: createJobService,
  deleteJob: deleteJobService,
  updateJob: updateJobService,
} = require('../services/jobService');

async function getJobsController(req, res) {
  try {
    const jobs = await getJobsService(req.user.email);
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function createJobController(req, res) {
  try {
    // קריאה לשירות, שמטפל ב-Scraping וב-AI באופן פנימי
    const job = await createJobService(req.user.email, req.body);
    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function deleteJobController(req, res) {
  const jobId = parseInt(req.params.id, 10);

  if (Number.isNaN(jobId)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  try {
    const deletedCount = await deleteJobService(req.user.email, jobId);

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function updateJobController(req, res) {
  const jobId = parseInt(req.params.id, 10);

  if (Number.isNaN(jobId)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  try {
    const updatedJob = await updateJobService(req.user.email, jobId, req.body);

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(updatedJob);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function uploadJobCvController(req, res) {
  const jobId = parseInt(req.params.id, 10);

  if (Number.isNaN(jobId)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  if (!supabase) {
    return res.status(500).json({ message: 'Storage is not configured' });
  }

  try {
    const userEmail = req.user.email;
    const originalName = req.file.originalname || 'cv';
    const parts = originalName.split('.');
    const fileExt = parts.length > 1 ? parts.pop() : 'pdf';
    const path = `${userEmail}/${jobId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(path, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload CV error:', uploadError);
      return res.status(500).json({
        message: 'Failed to upload CV',
        error: uploadError.message,
      });
    }

    const { data: publicData, error: publicUrlError } = supabase.storage
      .from('cvs')
      .getPublicUrl(path);

    if (publicUrlError) {
      console.error('Get public URL error:', publicUrlError);
      return res.status(500).json({
        message: 'Failed to generate CV URL',
        error: publicUrlError.message,
      });
    }

    const publicUrl = publicData?.publicUrl;

    if (!publicUrl) {
      return res.status(500).json({ message: 'Failed to generate CV URL' });
    }

    const updatedJob = await updateJobService(userEmail, jobId, {
      cvUrl: publicUrl,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // מחזירים את המשרה המעודכנת כולל cvUrl
    res.json(updatedJob);
  } catch (error) {
    console.error('Upload job CV error:', error);

    return res.status(500).json({
      message: 'Server error',
      details: error.message || null,
      meta: error.meta || null,
    });
  }
}

module.exports = {
  getJobs: getJobsController,
  createJob: createJobController,
  deleteJob: deleteJobController,
  updateJob: updateJobController,
  uploadJobCv: uploadJobCvController,
};