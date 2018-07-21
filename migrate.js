const db = require('db-migrate').getInstance(true);

db.createDatabase(process.env.MYSQL_DATABASE, function() {
  db.config.dev.database = process.env.MYSQL_DATABASE;
  db.up();
});
