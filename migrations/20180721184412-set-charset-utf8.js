'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = db => db.runSql(`alter database ${process.env.MYSQL_DATABASE} default character set utf8`);

exports.down = () => null;

exports._meta = {
  "version": 1
};
