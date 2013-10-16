"use strict";

var Joystick = require("./lib/joystick")
  , exports = module.exports = Joystick;

exports.create = function (device, cb) {
  var joystick = new Joystick();

  joystick.open(device, function (err) {
    if (err) {
      return cb(err);
    }

    joystick.read();
    cb(undefined, joystick);
  });
};
