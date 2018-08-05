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

exports.up = db => db.createTable('emails', {
  id: {
    type: 'int',
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: 'string',
    length: 255,
    unique: true,
  },
  deleted: {
    type: 'boolean',
    defaultValue: false,
  },
  created: {
    type: 'timestamp',
    defaultValue: new String('now()'),
  },
});

exports.down = db => db.dropTable('emails');

exports._meta = {
  "version": 1
};
