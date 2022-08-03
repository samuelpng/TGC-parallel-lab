'use strict';

const { text } = require("express");

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

exports.up = function(db) {
  return db.createTable('media-property', {
    id: {type: 'int', unsigned: true, primaryKey: true, autoIncrement: true},
    name: {type: 'string', length: 100},
    description: 'text',
    url: 'text'
  })
};

exports.down = function(db) {
  return db.dropTable('media-property')
};

exports._meta = {
  "version": 1
};
