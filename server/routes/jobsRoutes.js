// server/routes/jobsRoutes.js
const express = require('express');
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});
const {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
  uploadJobCv,
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getJobs);
router.post('/', createJob);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);
router.post('/:id/cv', upload.single('cv'), uploadJobCv);

module.exports = router;

