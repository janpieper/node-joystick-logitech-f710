var Joystick = require("..");

Joystick.create("/dev/input/js0", function (err, joystick) {
  if (err) {
    console.log("ERROR", err);
  }

  // Button A

  joystick.on("button:a:press", function () {
    console.log("Button A pressed");
  });

  joystick.on("button:a:release", function () {
    console.log("Button A released");
  });

  // Button B

  joystick.on("button:b:press", function () {
    console.log("Button B pressed");
  });

  joystick.on("button:b:release", function () {
    console.log("Button B released");
  });

  // Button X

  joystick.on("button:x:press", function () {
    console.log("Button X pressed");
  });

  joystick.on("button:x:release", function () {
    console.log("Button X released");
  });

  // Button Y

  joystick.on("button:y:press", function () {
    console.log("Button Y pressed");
  });

  joystick.on("button:y:release", function () {
    console.log("Button Y released");
  });

  // Button LB

  joystick.on("button:lb:press", function () {
    console.log("Button LB pressed");
  });

  joystick.on("button:lb:release", function () {
    console.log("Button LB released");
  });

  // Button RB

  joystick.on("button:rb:press", function () {
    console.log("Button RB pressed");
  });

  joystick.on("button:rb:release", function () {
    console.log("Button RB released");
  });

  // Button LT

  joystick.on("button:lt:press", function () {
    console.log("Button LT pressed");
  });

  joystick.on("button:lt:release", function () {
    console.log("Button LT released");
  });

  // Button RT

  joystick.on("button:rt:press", function () {
    console.log("Button RT pressed");
  });

  joystick.on("button:rt:release", function () {
    console.log("Button RT released");
  });

  // Button Back

  joystick.on("button:back:press", function () {
    console.log("Button Back pressed");
  });

  joystick.on("button:back:release", function () {
    console.log("Button Back released");
  });

  // Button Start

  joystick.on("button:start:press", function () {
    console.log("Button Start pressed");
  });

  joystick.on("button:start:release", function () {
    console.log("Button Start released");
  });

  // Button Stick Left

  joystick.on("button:ls:press", function () {
    console.log("Left Stick pressed");
  });

  joystick.on("button:ls:release", function () {
    console.log("Left Stick released");
  });

  // Button Stick Right

  joystick.on("button:rs:press", function () {
    console.log("Right Stick pressed");
  });

  joystick.on("button:rs:release", function () {
    console.log("Right Stick released");
  });

  // Stick 1 (Cross / Left Stick)

  joystick.on("stick:1:vertical:up", function (position) {
    console.log("Stick 1 pushed up to position: " + position);
  });

  joystick.on("stick:1:vertical:down", function (position) {
    console.log("Stick 1 pulled down to position: " + position);
  });

  joystick.on("stick:1:vertical:zero", function (position) {
    console.log("Stick 1 vertically released to position: " + position);
  });

  joystick.on("stick:1:horizontal:left", function (position) {
    console.log("Stick 1 pushed left to position: " + position);
  });

  joystick.on("stick:1:horizontal:right", function (position) {
    console.log("Stick 1 pushed right to position: " + position);
  });

  joystick.on("stick:1:horizontal:zero", function (position) {
    console.log("Stick 1 horizontally released to position: " + position);
  });

  // Stick 2 (Left Stick / Cross)

  joystick.on("stick:2:vertical:up", function (position) {
    console.log("Stick 2 pushed up to position: " + position);
  });

  joystick.on("stick:2:vertical:down", function (position) {
    console.log("Stick 2 pulled down to position: " + position);
  });

  joystick.on("stick:2:vertical:zero", function (position) {
    console.log("Stick 2 vertically released to position: " + position);
  });

  joystick.on("stick:2:horizontal:left", function (position) {
    console.log("Stick 2 pushed left to position: " + position);
  });

  joystick.on("stick:2:horizontal:right", function (position) {
    console.log("Stick 2 pushed right to position: " + position);
  });

  joystick.on("stick:2:horizontal:zero", function (position) {
    console.log("Stick 2 horizontally released to position: " + position);
  });

  // Stick 3 (Right Stick)

  joystick.on("stick:3:vertical:up", function (position) {
    console.log("Stick 3 pushed up to position: " + position);
  });

  joystick.on("stick:3:vertical:down", function (position) {
    console.log("Stick 3 pulled down to position: " + position);
  });

  joystick.on("stick:3:vertical:zero", function (position) {
    console.log("Stick 3 vertically released to position: " + position);
  });

  joystick.on("stick:3:horizontal:left", function (position) {
    console.log("Stick 3 pushed left to position: " + position);
  });

  joystick.on("stick:3:horizontal:right", function (position) {
    console.log("Stick 3 pushed right to position: " + position);
  });

  joystick.on("stick:3:horizontal:zero", function (position) {
    console.log("Stick 3 horizontally released to position: " + position);
  });
});
