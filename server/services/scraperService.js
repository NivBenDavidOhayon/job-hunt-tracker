// server/services/scraperService.js
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * מנסה לסרוק כתובת URL ולחלץ את טקסט המשרה הרלוונטי.
 * @param {string} url - כתובת המשרה.
 * @returns {Promise<string|null>} - טקסט המשרה שחולץ או null.
 */
async function scrapeJobDescription(url) {
  if (!url) return null;
  console.log(`🤖 Scraping URL: ${url}`);

  try {
    const response = await axios.get(url, {
      // הגדרת Header כדי לחקות דפדפן ולמנוע חסימה
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      // הגדרה לקבל רק תגובות 2xx
      validateStatus: (status) => status >= 200 && status < 300
    });

    // בדיקה שבאמת קיבלנו תוכן HTML
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.includes('text/html')) {
        console.log('⚠️ URL does not point to an HTML page.');
        return null;
    }

    const html = response.data;
    const $ = cheerio.load(html);

    // לוגיקה פשוטה לשליפת התוכן: מנסים למצוא את התוכן הטקסטואלי הכי משמעותי
    // זה קשה ודורש התאמה לאתרים ספציפיים (LinkedIn, Glassdoor, וכו').
    // כברירת מחדל, ננסה לשלוף את הטקסט מ-body.
    let text = $('body').text();
    
    // ניקוי בסיסי (הסרת רווחים כפולים וירידות שורה מרובות)
    text = text.replace(/(\s\s+|\n\n+)/g, ' ').trim();

    // מגבלה הגיונית על אורך הטקסט (כדי לא לשלוח ל-AI קבצים שלמים)
    const MAX_LENGTH = 10000;
    if (text.length > MAX_LENGTH) {
        text = text.substring(0, MAX_LENGTH) + '... (truncated)';
    }

    if (text.length < 50) {
        console.log('⚠️ Scraped text is too short, possibly a block.');
        return null;
    }

    console.log(`✅ Scraped ${text.length} characters.`);
    return text;

  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    return null;
  }
}

module.exports = {
  scrapeJobDescription,
};