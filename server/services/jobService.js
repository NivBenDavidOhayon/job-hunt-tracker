// server/services/jobService.js
const prisma = require('../prismaClient');
const { scrapeJobDescription } = require('./scraperService');
const { analyzeJobDescription } = require('./aiService');

async function getJobs(userEmail) {
  return prisma.job.findMany({
    where: { userEmail },
    orderBy: { createdAt: 'desc' },
  });
}

async function createJob(userEmail, jobData) {
  const { companyName, positionTitle, link, status } = jobData;

  // --- שלב 1: Scraping ---
  let description = null;
  if (link) {
    description = await scrapeJobDescription(link);
  }

  // --- שלב 2: AI Analysis ---
  let aiData = {};
  if (description) {
    const analysisResult = await analyzeJobDescription(description);
  
    if (analysisResult) {
      // 👇 נשנה את שמות השדות כדי להתאים למודל Prisma החדש
      aiData.description = analysisResult.description; 
      aiData.aiLevel = analysisResult.aiLevel;
      aiData.aiTags = analysisResult.aiTags; 
      aiData.aiSummaryRole = analysisResult.aiSummaryRole; // 👈 חדש
      aiData.aiSummaryTech = analysisResult.aiSummaryTech; // 👈 חדש
      aiData.aiJobType = analysisResult.aiJobType;     // 👈 חדש
    } else {
      aiData.description = description;
    }
  }

  // --- שלב 3: שמירה ב-DB ---
  return prisma.job.create({
    data: {
      userEmail,
      companyName,
      positionTitle,
      link: link || null,
      status: status || 'Applied',
      // שילוב נתוני ה-AI/Scraping
      ...aiData, 
    },
  });
}

async function deleteJob(userEmail, jobId) {
  const result = await prisma.job.deleteMany({
    where: { id: jobId, userEmail },
  });

  // נחזיר את מספר הרשומות שנמחקו למקרה שה־controller רוצה לדעת
  return result.count;
}

/**
 * מעדכן משרה באופן חלקי ומחזיר את האובייקט המעודכן.
 * אם לא נמצאה משרה – מחזיר null.
 * אם לא נשלחו שדות לעדכון – מחזיר את המשרה כפי שהיא.
 */
async function updateJob(userEmail, jobId, jobData) {
  const { companyName, positionTitle, link, status, cvUrl } = jobData;
  const data = {};

  if (companyName !== undefined) data.companyName = companyName;
  if (positionTitle !== undefined) data.positionTitle = positionTitle;
  if (link !== undefined) data.link = link || null;
  if (status !== undefined) data.status = status;
  if (cvUrl !== undefined) data.cvUrl = cvUrl;

  // אם אין שום דבר לעדכן – נחזיר את המשרה הקיימת (או null אם לא קיימת)
  if (Object.keys(data).length === 0) {
    return prisma.job.findFirst({
      where: { id: jobId, userEmail },
    });
  }

  const result = await prisma.job.updateMany({
    where: { id: jobId, userEmail },
    data,
  });

  if (result.count === 0) {
    // לא עודכנו רשומות – כנראה המשרה לא שייכת למשתמש / לא קיימת
    return null;
  }

  // מחזירים את המשרה המעודכנת
  const updated = await prisma.job.findFirst({
    where: { id: jobId, userEmail },
  });

  return updated;
}

module.exports = {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
};