# Logitech Gamepad F710

Node.js module to read joystick data from [Logitech Gamepad F710](http://gaming.logitech.com/en-us/product/f710-wireless-gamepad).

[![Build Status](https://secure.travis-ci.org/janpieper/node-joystick-logitech-f710.png?branch=master)](http://travis-ci.org/janpieper/node-joystick-logitech-f710)

## Installation

### Using NPM

`npm install node-joystick-logitech-f710`

## Example

````javascript
var Joystick = require("joystick-logitech-f710");

Joystick.create("/dev/input/js0", function (joystick) {
  joystick.on("button:a:press", function () {
    console.log("jump");
  });

  joystick.on("button:b:press", function () {
    console.log("fire");
  });
});
````

## TODOs

* Scale original position values (e.g. `0..65535` to `0..100`)
* Identify stick switch after pressing "Select" button to have more specific event names
* Trigger gamepad vibration
