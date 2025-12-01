import express from 'express';
import prisma from '../prismaClient.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { company, position, link, status } = req.body;

    if (!company || !position) {
      return res.status(400).json({ message: 'Company and position are required' });
    }

    const newJob = await prisma.job.create({
      data: {
        companyName: company,
        positionTitle: position,
        link: link || null,
        status: status || 'Pending',
        userId: req.user.id,
      },
    });

    return res.status(201).json(newJob);
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({ message: 'Failed to create job' });
  }
});

export default router;

