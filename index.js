"use strict";

var Joystick = require("./lib/joystick")
  , exports = module.exports = Joystick;

exports.create = function (device, inputMode, cb) {
  if (typeof(inputMode) === "function" && typeof(cb) === "undefined") {
    cb = inputMode;
    inputMode = null;
  }

  var joystick = new Joystick();

  if (inputMode !== null) {
    try {
      joystick.setInputMode(inputMode);
    } catch (e) {
      return cb(e);
    }
  }

  joystick.open(device, function (err) {
    if (err) {
      return cb(err);
    }

    joystick.initialize(function (err) {
      if (err) {
        return cb(err);
      }

      joystick.readAndHandle();
      cb(undefined, joystick);
    });
  });
};
