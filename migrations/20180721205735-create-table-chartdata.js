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

exports.up = db => db.createTable('chartdata', {
  id: {
    type: 'int',
    autoIncrement: true,
    primaryKey: true,
  },
  time: {
    type: 'timestamp',
    unique: true,
  },
  openBid: {
    type: 'int',
  },
  closeBid: {
    type: 'int',
  },
  highBid: {
    type: 'int',
  },
  lowBid: {
    type: 'int',
  },
});

exports.down = db => db.dropTable('chartdata');

exports._meta = {
  "version": 1
};
