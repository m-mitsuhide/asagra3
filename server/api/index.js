const router = require('express').Router();
const Model = require('quick-mysql/lib/Model');

router.get('/chartdata', async (req, res) => {
  const limit = req.query.limit || 30;
  const result = await Model.fetch(`
    SELECT *
    FROM chartdata
    ORDER BY time desc
    LIMIT ?
  `, [limit]);

  res.json(result);
});

module.exports = router;
