// server/services/jobService.js
const prisma = require('../prismaClient');
const { scrapeJobDescription } = require('./scraperService');
const { analyzeJobDescription } = require('./aiService');

async function getJobs(userEmail) {
  // מושך את כל שדות המשרה, כולל הנתונים המנותחים מה-AI
  return prisma.job.findMany({
    where: { userEmail },
    orderBy: { createdAt: 'desc' },
  });
}

async function createJob(userEmail, jobData) {
  // נשתמש ב-let כדי שנוכל לעדכן את positionTitle בהמשך
  let { companyName, positionTitle, link, status } = jobData; 

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
      // 🥇 מילוי אוטומטי חובה: מעדכנים את positionTitle בערך שחולץ מה-AI.
      // כך, גם אם המשתמש לא הזין כותרת, או הזין כותרת לא מדויקת, ה-AI מתקן אותה.
      if (analysisResult.positionTitle) {
          positionTitle = analysisResult.positionTitle;
      }

      // 👇 מיפוי כל שדות ה-AI (החדשים והקיימים)
      aiData.description = description; // שמירת הטקסט שנסרק ב-DB
      aiData.aiLevel = analysisResult.aiLevel;
      aiData.aiTags = analysisResult.aiTags; 
      aiData.aiSummaryRole = analysisResult.aiSummaryRole; 
      aiData.aiSummaryTech = analysisResult.aiSummaryTech; 
      aiData.aiJobType = analysisResult.aiJobType;     
    } else {
      // אם ניתוח ה-AI נכשל, לפחות נשמור את התיאור שנסרק
      aiData.description = description;
    }
  }

  // --- שלב 3: שמירה ב-DB ---
  return prisma.job.create({
    data: {
      userEmail,
      companyName,
      // משתמשים ב-positionTitle המעודכן. אם הוא עדיין ריק (כי אין קישור/ה-AI נכשל), נשתמש בברירת מחדל
      positionTitle: positionTitle || 'Untitled Job', 
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
  return result.count;
}

/**
 * מעדכן משרה באופן חלקי ומחזיר את האובייקט המעודכן.
 */
async function updateJob(userEmail, jobId, jobData) {
  const { companyName, positionTitle, link, status, cvUrl } = jobData;
  const data = {};

  if (companyName !== undefined) data.companyName = companyName;
  if (positionTitle !== undefined) data.positionTitle = positionTitle;
  if (link !== undefined) data.link = link || null;
  if (status !== undefined) data.status = status;
  if (cvUrl !== undefined) data.cvUrl = cvUrl;

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
    return null;
  }

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