// server/services/jobService.js
const prisma = require('../prismaClient');

async function getJobs(userEmail) {
  return prisma.job.findMany({
    where: { userEmail },
    orderBy: { createdAt: 'desc' },
  });
}

async function createJob(userEmail, jobData) {
  return prisma.job.create({
    data: {
      ...jobData,
      userEmail,
    },
  });
}

module.exports = {
  getJobs,
  createJob,
};

