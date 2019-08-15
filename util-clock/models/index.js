var diskAdapter = require('sails-disk');
var Waterline = require('waterline');
var fs = require('fs');
var path = require('path');

var orm = new Waterline();

var config = {
    adapters: {
        'default': diskAdapter,
        disk: diskAdapter
    },
    connections: {
        save: {
            adapter: 'disk',
            filePath: ''
        }
    },
    defaults: {
        migrate: 'safe'
    }
};

fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = require(path.join(__dirname, file));
    orm.loadCollection(model);
  });

module.exports = {waterline: orm, config: config};