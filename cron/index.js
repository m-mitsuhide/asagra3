require('dotenv').config();
const { CronJob } = require('cron');
const axios = require('axios');
const Model = require('quick-mysql/lib/Model');

let lastTime = 0;

new CronJob('*/30 * * * * *', async () => {
  try {
    const { data } = await axios.get('https://cc.minkabu.jp/api/bar/BTC-JPY.json?range=10m&limit=48');
    const lastData = data.pop();

    if (lastData.time > lastTime) {
      lastTime = lastData.time;
      await Model.fetch(`
        INSERT INTO chartdata (
          time,
          openBid,
          closeBid,
          highBid,
          lowBid
        ) VALUES (FROM_UNIXTIME(?), ?, ?, ?, ?)
      `, [
        lastData.time,
        lastData.openBid,
        lastData.closeBid,
        lastData.highBid,
        lastData.lowBid,
      ]);
    }
  } catch(e) {
    console.log('cron error:', e.message);
  }
}, null, true);