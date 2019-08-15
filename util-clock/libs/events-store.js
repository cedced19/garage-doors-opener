var fs = require('fs');

function EventStore(init, path) {
  this.path = path;
  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify(init));
  this.EventStore = require(path);
}

EventStore.prototype.getAll = function () {
    return this.EventStore;
}

EventStore.prototype.get = function (id) {
    if (this.EventStore.hasOwnProperty(id)) {
        return this.EventStore[id];
    } else {
        return '';
    }
}

EventStore.prototype.put = function (id, val, cb) {
    this.EventStore[id] = val;
    this.save(cb);
}

EventStore.prototype.save = function (cb) {
    fs.writeFile(this.path, JSON.stringify(this.EventStore), cb);
}

module.exports = function(init, path) {
  return new EventStore(init, path);
}