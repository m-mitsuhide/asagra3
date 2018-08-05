require('dotenv').config();
const { CronJob } = require('cron');
const axios = require('axios');
const Model = require('quick-mysql/lib/Model');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

new CronJob('00 */1 * * * *', async () => {
  console.log('start cron.');

  try {
    const { data } = await axios.get('https://cc.minkabu.jp/api/bar/BTC-JPY.json?range=10m&limit=48');
    const sqlText = [];
    const values = [];
    
    for (let i = 0; i < data.length; i += 1) {
      const current = data[i];
      sqlText.push('(FROM_UNIXTIME(?), ?, ?, ?, ?)');
      values.push(
        current.time / 1000,
        current.openBid,
        current.closeBid,
        current.highBid,
        current.lowBid,
      );
    }

    await Model.fetch(`
      INSERT INTO chartdata (
        time,
        openBid,
        closeBid,
        highBid,
        lowBid
      ) VALUES ${sqlText.join(',')}
      ON DUPLICATE KEY UPDATE
        time = VALUES(time),
        openBid = VALUES(openBid),
        closeBid = VALUES(closeBid),
        highBid = VALUES(highBid),
        lowBid = VALUES(lowBid)
    `, values);
  } catch(e) {
    console.log('cron error:', e.message);
  }
}, null, true);

new CronJob('00 */1 * * * *', async () => {
  console.log('send mail.');

  try {
    const values = await Model.fetch(`
      SELECT *
      FROM chartdata
      ORDER BY id desc
      LIMIT 1
    `);

    const emails = await Model.fetch(`
      SELECT email
      FROM emails
      WHERE deleted = false
    `);

    if (values.length === 0 || emails.length === 0) return;

    const lastValue = values[0];

    for (let i = 0; i < emails.length; i += 1) {
      const msg = {
        to: emails[i].email,
        from: 'genbu2011@live.jp',
        subject: '現在の仮想通貨価格',
        html: `
          <ul>
            <li><strong>日付：${lastValue.time}</strong></li>
            <li><strong>高値：${lastValue.highBid} / 安値：${lastValue.lowBid}</strong></li>
          </ul>
          <br/>
          <a href="${process.env.SITE_HOST}/?deleted=${emails[i].email}" target="_brank">購読解除はこちらから</a>
        `,
      };

      await sgMail.send(msg);
    }
  } catch(e) {
    console.log('cron error:', e.message);
  }
}, null, true);