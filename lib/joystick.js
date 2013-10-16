"use strict";

var fs = require("fs")
  , EventEmitter = require("events").EventEmitter
  , util = require("util");

var Joystick = function () {
  this.fd = null;
};

module.exports = Joystick;
util.inherits(Joystick, EventEmitter);

Joystick.prototype.open = function (device, cb) {
  var self = this;

  fs.open(device, "r", function (err, fd) {
    if (err) {
      return cb(new Error(util.format(
        "Failed opening device '%s' (%s)",
        device, err.message
      )));
    }

    self.fd = fd;
    cb();
  });
};

Joystick.prototype.read = function () {
  var self = this;

  if (self.fd) {
    var buffer = new Buffer(8);

    fs.read(self.fd, buffer, 0, buffer.length, null, function (err, bytesRead) {
      if (err) {
        self.emit("readerror", err);
      } else if (bytesRead > 0) {
        self.handle(buffer);
      }

      self.read();
    });
  }
};

Joystick.prototype.close = function () {
  fs.closeSync(this.fd);
  this.fd = null;
};

Joystick.prototype.handle = function (bytes) {
  var hex = bytes.toString("hex")
    , byte5 = hex.slice(8, 10)
    , byte6 = hex.slice(10, 12)
    , byte7 = hex.slice(12, 14)
    , byte8 = hex.slice(14, 16);

  if (byte7 === "01") {
    this.handleButtons(byte5, byte8);
  } else if (byte7 === "02") {
    this.handleSticks(byte5, byte6, byte8);
  }
};

Joystick.prototype.getButtonByByte = function (byte8) {
  var buttons = [ "x", "a", "b", "y", "lb", "rb", "lt", "rt", "back", "start", "ls", "rs" ];
  return buttons[parseInt(byte8, 16)];
};

Joystick.prototype.handleButtons = function (byte5, byte8) {
  var button = this.getButtonByByte(byte8);

  if (byte5 === "01") {
    this.emit("button:" + button + ":press");
  } else if (byte5 === "00") {
    this.emit("button:" + button + ":release");
  }
};

Joystick.prototype.getStickByByte = function (byte8) {
  if (byte8 === "00" || byte8 === "01") {
    return 1;
  } else if (byte8 === "02" || byte8 === "03") {
    return 2;
  } else if (byte8 === "04" || byte8 === "05") {
    return 3;
  }
  return null;
};

Joystick.prototype.handleSticks = function (byte5, byte6, byte8) {
  var position = parseInt([byte6, byte5].join(""), 16)
    , stick = this.getStickByByte(byte8);

  if (byte8 === "00" || byte8 === "02" || byte8 === "04") {
    this.handleHorizontalStickMovement(stick, position);
  } else if (byte8 === "01" || byte8 === "03" || byte8 === "05") {
    this.handleVerticalStickMovement(stick, position);
  }
};

Joystick.prototype.handleHorizontalStickMovement = function (stick, position) {
  if (position > 0 && position <= 32767) {
    this.emit("stick:" + stick + ":horizontal:right", position);
  } else if (position >= 32768 && position <= 65535) {
    this.emit("stick:" + stick + ":horizontal:left", position);
  } else if (position === 0) {
    this.emit("stick:" + stick + ":horizontal:zero", position);
  }
};

Joystick.prototype.handleVerticalStickMovement = function (stick, position) {
  if (position > 0 && position <= 32767) {
    this.emit("stick:" + stick + ":vertical:down", position);
  } else if (position >= 32768 && position <= 65535) {
    this.emit("stick:" + stick + ":vertical:up", position);
  } else if (position === 0) {
    this.emit("stick:" + stick + ":vertical:zero", position);
  }
};
