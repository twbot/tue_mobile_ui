(function () {
'use strict';

/* global EventEmitter2 */

var entities_topic_name = 'ed/gui/entities';

function Ed (robot) {
  EventEmitter2.apply(this);

  var ros = robot.ros;

  this.entities = [];
  this.entities_topic = ros.Topic({
    name: entities_topic_name,
    messageType: 'ed_gui_server/EntityInfos',
    throttle_rate: 5000,
  });
  // this.entities_topic.subscribe(this.onEntities.bind(this));

  this.models = [];
}

Ed.prototype = Object.create(EventEmitter2.prototype);

Object.defineProperty(Ed.prototype, 'entities', {
  get: function() {
    return this._entities;
  },
  set: function(entities) {
    this._entities = entities;
    this.emit('entities', entities);
  }
});

Ed.prototype.onEntities = function(msg) {
  console.log(msg);
  this.entities = msg.entities;
};

Object.defineProperty(Ed.prototype, 'models', {
  get: function() {
    return this._models;
  },
  set: function(models) {
    this._models = models;
    this.emit('models', models);
  }
});

Ed.prototype.updateModels = function() {
  this.models = [
    { name: 'Coke', src: 'images/coca-cola.jpg' },
    { name: 'Fanta', src: 'images/coca-cola.jpg' },
    { name: 'd7f7', src: 'images/coca-cola.jpg' },
    { name: '32', src: 'images/coca-cola.jpg' },
    { name: 'd73f7', src: 'images/coca-cola.jpg' },
    { name: 'd7f27', src: 'images/coca-cola.jpg' },
    { name: 'd3217f7', src: 'images/coca-cola.jpg' },
    { name: 'd73f7', src: 'images/coca-cola.jpg' },
    { name: 'd7f7', src: 'images/coca-cola.jpg' },
    { name: 'd7f2317', src: 'images/coca-cola.jpg' },
    { name: 'd7321f7', src: 'images/coca-cola.jpg' },
    { name: 'd3213127f7', src: 'images/coca-cola.jpg' },
    { name: 'd7312f7', src: 'images/coca-cola.jpg' },
    { name: 'd7312f7', src: 'images/coca-cola.jpg' },
    { name: 'd7312f7', src: 'images/coca-cola.jpg' },
    { name: 'd317f7', src: 'images/coca-cola.jpg' },
  ];
};

window.Ed = Ed;

})();
