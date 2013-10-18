# Logitech Gamepad F710

Node.js module to read joystick data from [Logitech Gamepad F710](http://gaming.logitech.com/en-us/product/f710-wireless-gamepad).

[![Build Status](https://secure.travis-ci.org/janpieper/node-joystick-logitech-f710.png?branch=master)](http://travis-ci.org/janpieper/node-joystick-logitech-f710)
[![NPM version](https://badge.fury.io/js/joystick-logitech-f710.png)](http://badge.fury.io/js/joystick-logitech-f710)

## Installation

### Using NPM

`npm install node-joystick-logitech-f710`

## Example

````javascript
var Joystick = require("joystick-logitech-f710");

Joystick.create("/dev/input/js0", function (err, joystick) {
  if (err) {
    throw err;
  }

  joystick.on("button:a:press", function () {
    console.log("jump");
  });

  joystick.on("button:b:press", function () {
    console.log("fire");
  });
});
````

## Available Events

### Buttons

* Button A
  * `button:a:press`
  * `button:a:release`
* Button B
  * `button:b:press`
  * `button:b:release`
* Button X
  * `button:x:press`
  * `button:x:release`
* Button Y
  * `button:y:press`
  * `button:y:release`
* Button LB
  * `button:lb:press`
  * `button:lb:release`
* Button RB
  * `button:rb:press`
  * `button:rb:release`
* Button LT
  * `button:lt:press`
  * `button:lt:release`
* Button RT
  * `button:rt:press`
  * `button:rt:release`
* Button Back
  * `button:back:press`
  * `button:back:release`
* Button Start
  * `button:start:press`
  * `button:start:release`
* Left Stick
  * `button:ls:press`
  * `button:ls:release`
* Right Stick
  * `button:rs:press`
  * `button:rs:release`

#### Example

````javascript
joystick.on("button:start:press", function () {
  console.log("start button has been pressed");
});
````

### Sticks

* Cross
  * `stick:1:vertical:up`
  * `stick:1:vertical:down`
  * `stick:1:vertical:zero`
  * `stick:1:horizontal:right`
  * `stick:1:horizontal:left`
  * `stick:1:horizontal:zero`
* Left Stick
  * `stick:2:vertical:up`
  * `stick:2:vertical:down`
  * `stick:2:vertical:zero`
  * `stick:2:horizontal:right`
  * `stick:2:horizontal:left`
  * `stick:2:horizontal:zero`
* Right Stick
  * `stick:3:vertical:up`
  * `stick:3:vertical:down`
  * `stick:3:vertical:zero`
  * `stick:3:horizontal:right`
  * `stick:3:horizontal:left`
  * `stick:3:horizontal:zero`

Each of these events will be emitted with the current stick position. Possible
position values (unscaled):

* `*:up` = 1..32767
* `*:down` = 1..32767
* `*:right` = 1..32767
* `*:left` = 1..32767
* `*:zero` = 0

This should help to understand what values you can expect:

````
       32767
         |
32767 -- 0 -- 32767
         |
       32767
````

You can scale the maximum axes position to a value between 1 and 32767:

````javascript
joystick.setMaximumAxesPosition(100);
````

Now you can expect the following position values:

````
        100
         |
  100 -- 0 -- 100
         |
        100
````

#### Example

````javascript
joystick.on("stick:1:vertical:up", function (position) {
  console.log("current up position: " + position);
});
````

## TODOs

* Identify stick switch after pressing "Select" button to have more specific event names
* Trigger gamepad vibration
