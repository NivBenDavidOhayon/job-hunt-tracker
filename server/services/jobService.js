// server/services/jobService.js
const prisma = require('../prismaClient');

async function getJobs(userEmail) {
  return prisma.job.findMany({
    where: { userEmail },
    orderBy: { createdAt: 'desc' },
  });
}

async function createJob(userEmail, jobData) {
  const { companyName, positionTitle, link, status } = jobData;

  return prisma.job.create({
    data: {
      userEmail,
      companyName,
      positionTitle,
      link: link || null,
      status: status || 'Applied',
    },
  });
}

module.exports = {
  getJobs,
  createJob,
};

