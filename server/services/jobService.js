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

async function deleteJob(userEmail, jobId) {
  const result = await prisma.job.deleteMany({
    where: { id: jobId, userEmail },
  });

  return result.count;
}

async function updateJob(userEmail, jobId, jobData) {
  const { companyName, positionTitle, link, status } = jobData;
  const data = {};

  if (companyName !== undefined) data.companyName = companyName;
  if (positionTitle !== undefined) data.positionTitle = positionTitle;
  if (link !== undefined) data.link = link || null;
  if (status !== undefined) data.status = status;

  if (Object.keys(data).length === 0) {
    return prisma.job.findFirst({
      where: { id: jobId, userEmail },
    });
  }

  const updated = await prisma.job.updateMany({
    where: { id: jobId, userEmail },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  return prisma.job.findFirst({
    where: { id: jobId, userEmail },
  });
}

module.exports = {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
};

