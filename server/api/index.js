const router = require('express').Router();
const Model = require('quick-mysql/lib/Model');

router.get('/chartdata', async (req, res) => {
  const limit = +req.query.limit || 30;
  const result = await Model.fetch(`
    SELECT *
    FROM chartdata
    ORDER BY time desc
    LIMIT ?
  `, [limit]);

  res.json(result);
});

router.post('/email', async (req, res) => {
  const email = req.body.email;

  await Model.fetch(`
    INSERT INTO emails (
      email
    )
    VALUES (?)
    ON DUPLICATE KEY UPDATE
      email = VALUES(email),
      deleted = false
  `, [email]);

  res.json({
    email,
  });
});

router.delete('/email', async (req, res) => {
  const email = req.body.email;

  await Model.fetch(`
    UPDATE emails
    SET deleted = true
    WHERE email = ?
  `, [email]);

  res.json({
    email,
  });
});

module.exports = router;
