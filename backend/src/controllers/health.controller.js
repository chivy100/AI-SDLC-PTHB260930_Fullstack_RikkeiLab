const healthService = require('../services/health.service');

async function getHealth(req, res) {
  try {
    const result = await healthService.checkHealth();
    return res.status(200).json(result);
  } catch (err) {
    console.error(`[HEALTH CHECK] Database connection failed (${err.code || 'UNKNOWN'})`);
    return res.status(503).json({
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'Không thể kết nối cơ sở dữ liệu. Vui lòng thử lại sau.',
      },
    });
  }
}

module.exports = { getHealth };
