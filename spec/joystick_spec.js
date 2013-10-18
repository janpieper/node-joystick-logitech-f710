"use strict";

var Joystick = require("../index")
  , fs = require("fs")
  , os = require("os")
  , INPUT_FILE = os.tmpDir() + "/dev-input-js0";

describe("Joystick", function () {
  describe("Creation", function () {
    var cb;

    beforeEach(function () {
      cb = jasmine.createSpy();
    });

    it("should call callback with an error if input device does not exist", function () {
      Joystick.create("not-existent", cb);

      waitsFor(function () {
        return cb.wasCalled;
      });

      runs(function () {
        expect(cb).toHaveBeenCalledWith(jasmine.any(Error));
      });
    });

    it("should call callback with no error and an instance of Joystick", function () {
      fs.writeFileSync(INPUT_FILE, "dummy");
      Joystick.create(INPUT_FILE, cb);

      waitsFor(function () {
        return cb.wasCalled;
      }, 100);

      runs(function () {
        cb.mostRecentCall.args[1].close();
        expect(cb).toHaveBeenCalledWith(undefined, jasmine.any(Joystick));
      });
    });
  });

  describe("Position Scaling", function () {
    var joystick;

    beforeEach(function () {
      joystick = undefined;
      Joystick.create(INPUT_FILE, function (_, j) {
        joystick = j;
      });

      waitsFor(function () {
        return !!joystick;
      });
    });

    afterEach(function () {
      joystick.close();
    });

    it("should throw an Error if given maximum is no valid integer value", function () {
      expect(function () {
        joystick.setMaximumAxesPosition("non-numeric-value");
      }).toThrow(
        "Given maximum axes position 'non-numeric-value' is no valid " +
        "integer value. It must be a value between 1 and 65535."
      );
    });

    it("should throw an Error if given maximum is lower than 1", function () {
      expect(function () {
        joystick.setMaximumAxesPosition(-100);
      }).toThrow(
        "Cannot change maximum axes position to -100. The value must be " +
        "greater than 1."
      );
    });

    it("should throw an Error if maximum is greater than 65535", function () {
      expect(function () {
        joystick.setMaximumAxesPosition(100000);
      }).toThrow(
        "Cannot change maximum axes position to 100000. The possible " +
        "maximum position is limited to 65535 by the joystick."
      );
    });

    it("should successfully set maximum to 10000", function () {
      expect(function () {
        joystick.setMaximumAxesPosition(10000);
      }).not.toThrow();
    });
  });

  describe("Events", function () {
    var joystick;

    function simulateInputData(data) {
      data = data.replace(/\|/g, "");
      fs.appendFileSync(INPUT_FILE, new Buffer(data, "hex"));
    }

    function ensureInputFileExist() {
      fs.writeFileSync(INPUT_FILE, new Buffer("0000000000000000", "hex"));
    }

    function spyOnEventAndSimulateInputData(eventName, inputData) {
      var eventCallback = jasmine.createSpy("event callback");
      joystick.on(eventName, eventCallback);
      simulateInputData(inputData);
      waitsFor(function () { return eventCallback.wasCalled; }, 100);
      return eventCallback;
    }

    function expectEventOnInput(eventName, inputData) {
      var eventCallback = spyOnEventAndSimulateInputData(eventName, inputData);
      runs(function () { expect(eventCallback).toHaveBeenCalledWith(); });
    }

    function expectEventWithValueOnInput(eventName, eventValue, inputData) {
      var eventCallback = spyOnEventAndSimulateInputData(eventName, inputData);
      runs(function () { expect(eventCallback).toHaveBeenCalledWith(eventValue); });
    }

    beforeEach(function () {
      ensureInputFileExist();

      joystick = undefined;
      Joystick.create(INPUT_FILE, function (_, j) {
        joystick = j;
      });

      waitsFor(function () {
        return !!joystick;
      });
    });

    afterEach(function () {
      joystick.close();
    });

    describe("Buttons", function () {
      describe("X", function () {
        it("should emit 'button:x:press' if pressed", function () {
          expectEventOnInput("button:x:press", "00|00|00|00|01|00|01|00");
        });

        it("should emit 'button:x:release' if released", function () {
          expectEventOnInput("button:x:release", "00|00|00|00|00|00|01|00");
        });
      });

      describe("Y", function () {
        it("should emit 'button:y:press' if pressed", function () {
          expectEventOnInput("button:y:press", "00|00|00|00|01|00|01|03");
        });

        it("should emit 'button:y:release' if released", function () {
          expectEventOnInput("button:y:release", "00|00|00|00|00|00|01|03");
        });
      });

      describe("A", function () {
        it("should emit 'button:a:press' if pressed", function () {
          expectEventOnInput("button:a:press", "00|00|00|00|01|00|01|01");
        });

        it("should emit 'button:a:release' if released", function () {
          expectEventOnInput("button:a:release", "00|00|00|00|00|00|01|01");
        });
      });

      describe("B", function () {
        it("should emit 'button:b:press' if pressed", function () {
          expectEventOnInput("button:b:press", "00|00|00|00|01|00|01|02");
        });

        it("should emit 'button:b:release' if released", function () {
          expectEventOnInput("button:b:release", "00|00|00|00|00|00|01|02");
        });
      });

      describe("LB", function () {
        it("should emit 'button:lb:press' if pressed", function () {
          expectEventOnInput("button:lb:press", "00|00|00|00|01|00|01|04");
        });

        it("should emit 'button:lb:release' if released", function () {
          expectEventOnInput("button:lb:release", "00|00|00|00|00|00|01|04");
        });
      });

      describe("RB", function () {
        it("should emit 'button:rb:press' if pressed", function () {
          expectEventOnInput("button:rb:press", "00|00|00|00|01|00|01|05");
        });

        it("should emit 'button:rb:release' if released", function () {
          expectEventOnInput("button:rb:release", "00|00|00|00|00|00|01|05");
        });
      });

      describe("LT", function () {
        it("should emit 'button:lt:press' if pressed", function () {
          expectEventOnInput("button:lt:press", "00|00|00|00|01|00|01|06");
        });

        it("should emit 'button:lt:release' if released", function () {
          expectEventOnInput("button:lt:release", "00|00|00|00|00|00|01|06");
        });
      });

      describe("RT", function () {
        it("should emit 'button:rt:press' if pressed", function () {
          expectEventOnInput("button:rt:press", "00|00|00|00|01|00|01|07");
        });

        it("should emit 'button:rt:release' if released", function () {
          expectEventOnInput("button:rt:release", "00|00|00|00|00|00|01|07");
        });
      });

      describe("Back", function () {
        it("should emit 'button:back:press' if pressed", function () {
          expectEventOnInput("button:back:press", "00|00|00|00|01|00|01|08");
        });

        it("should emit 'button:back:release' if released", function () {
          expectEventOnInput("button:back:release", "00|00|00|00|00|00|01|08");
        });
      });

      describe("Start", function () {
        it("should emit 'button:start:press' if pressed", function () {
          expectEventOnInput("button:start:press", "00|00|00|00|01|00|01|09");
        });

        it("should emit 'button:start:release' if released", function () {
          expectEventOnInput("button:start:release", "00|00|00|00|00|00|01|09");
        });
      });

      describe("Left stick", function () {
        it("should emit 'button:ls:press' if pressed", function () {
          expectEventOnInput("button:ls:press", "00|00|00|00|01|00|01|0A");
        });

        it("should emit 'button:ls:release' if released", function () {
          expectEventOnInput("button:ls:release", "00|00|00|00|00|00|01|0A");
        });
      });

      describe("Right stick", function () {
        it("should emit 'button:rs:press' if pressed", function () {
          expectEventOnInput("button:rs:press", "00|00|00|00|01|00|01|0B");
        });

        it("should emit 'button:rs:release' if released", function () {
          expectEventOnInput("button:rs:release", "00|00|00|00|00|00|01|0B");
        });
      });
    });

    describe("Sticks", function () {
      describe("Cross", function () {
        describe("Standard Position", function () {
          it("should emit 'stick:1:vertical:up' with position 21846 if pushed up", function () {
            expectEventWithValueOnInput("stick:1:vertical:up", 21846, "00|00|00|00|AA|AA|02|05");
          });

          it("should emit 'stick:1:vertical:zero' with position 0 if vertically released", function () {
            expectEventWithValueOnInput("stick:1:vertical:zero", 0, "00|00|00|00|00|00|02|05");
          });

          it("should emit 'stick:1:vertical:down' with position 2570 if pulled down", function () {
            expectEventWithValueOnInput("stick:1:vertical:down", 2570, "00|00|00|00|0A|0A|02|05");
          });

          it("should emit 'stick:1:horizontal:right' with position 2570 if pushed right", function () {
            expectEventWithValueOnInput("stick:1:horizontal:right", 2570, "00|00|00|00|0A|0A|02|04");
          });

          it("should emit 'stick:1:horizontal:zero' with position 0 if horizontally released", function () {
            expectEventWithValueOnInput("stick:1:horizontal:zero", 0, "00|00|00|00|00|00|02|04");
          });

          it("should emit 'stick:1:horizontal:left' with position 21846 if pushed left", function () {
            expectEventWithValueOnInput("stick:1:horizontal:left", 21846, "00|00|00|00|AA|AA|02|04");
          });
        });

        describe("Scaled Position", function () {
          beforeEach(function () {
            joystick.setMaximumAxesPosition(100);
          });

          it("should emit 'stick:1:vertical:up' with position 67 if pushed up", function () {
            expectEventWithValueOnInput("stick:1:vertical:up", 67, "00|00|00|00|AA|AA|02|05");
          });

          it("should emit 'stick:1:vertical:zero' with position 0 if vertically released", function () {
            expectEventWithValueOnInput("stick:1:vertical:zero", 0, "00|00|00|00|00|00|02|05");
          });

          it("should emit 'stick:1:vertical:down' with position 8 if pulled down", function () {
            expectEventWithValueOnInput("stick:1:vertical:down", 8, "00|00|00|00|0A|0A|02|05");
          });

          it("should emit 'stick:1:horizontal:right' with position 8 if pushed right", function () {
            expectEventWithValueOnInput("stick:1:horizontal:right", 8, "00|00|00|00|0A|0A|02|04");
          });

          it("should emit 'stick:1:horizontal:zero' with position 0 if horizontally released", function () {
            expectEventWithValueOnInput("stick:1:horizontal:zero", 0, "00|00|00|00|00|00|02|04");
          });

          it("should emit 'stick:1:horizontal:left' with position 67 if pushed left", function () {
            expectEventWithValueOnInput("stick:1:horizontal:left", 67, "00|00|00|00|AA|AA|02|04");
          });
        });
      });

      describe("Left", function () {
        describe("Standard Position", function () {
          it("should emit 'stick:2:vertical:up' with position 21846 if pushed up", function () {
            expectEventWithValueOnInput("stick:2:vertical:up", 21846, "00|00|00|00|AA|AA|02|01");
          });

          it("should emit 'stick:2:vertical:zero' with position 0 if vertically released", function () {
            expectEventWithValueOnInput("stick:2:vertical:zero", 0, "00|00|00|00|00|00|02|01");
          });

          it("should emit 'stick:2:vertical:down' with position 2570 if pulled down", function () {
            expectEventWithValueOnInput("stick:2:vertical:down", 2570, "00|00|00|00|0A|0A|02|01");
          });

          it("should emit 'stick:2:horizontal:right' with position 2570 if pushed right", function () {
            expectEventWithValueOnInput("stick:2:horizontal:right", 2570, "00|00|00|00|0A|0A|02|00");
          });

          it("should emit 'stick:2:horizontal:zero' with position 0 if horizontally released", function () {
            expectEventWithValueOnInput("stick:2:horizontal:zero", 0, "00|00|00|00|00|00|02|00");
          });

          it("should emit 'stick:2:horizontal:left' with position 21846 if pushed left", function () {
            expectEventWithValueOnInput("stick:2:horizontal:left", 21846, "00|00|00|00|AA|AA|02|00");
          });
        });

        describe("Scaled Position", function () {
          beforeEach(function () {
            joystick.setMaximumAxesPosition(100);
          });

          it("should emit 'stick:2:vertical:up' with position 67 if pushed up", function () {
            expectEventWithValueOnInput("stick:2:vertical:up", 67, "00|00|00|00|AA|AA|02|01");
          });

          it("should emit 'stick:2:vertical:zero' with position 0 if vertically released", function () {
            expectEventWithValueOnInput("stick:2:vertical:zero", 0, "00|00|00|00|00|00|02|01");
          });

          it("should emit 'stick:2:vertical:down' with position 8 if pulled down", function () {
            expectEventWithValueOnInput("stick:2:vertical:down", 8, "00|00|00|00|0A|0A|02|01");
          });

          it("should emit 'stick:2:horizontal:right' with position 8 if pushed right", function () {
            expectEventWithValueOnInput("stick:2:horizontal:right", 8, "00|00|00|00|0A|0A|02|00");
          });

          it("should emit 'stick:2:horizontal:zero' with position 0 if horizontally released", function () {
            expectEventWithValueOnInput("stick:2:horizontal:zero", 0, "00|00|00|00|00|00|02|00");
          });

          it("should emit 'stick:2:horizontal:left' with position 67 if pushed left", function () {
            expectEventWithValueOnInput("stick:2:horizontal:left", 67, "00|00|00|00|AA|AA|02|00");
          });
        });
      });

      describe("Right", function () {
        describe("Standard Position", function () {
          it("should emit 'stick:3:vertical:up' with position 21846 if pushed up", function () {
            expectEventWithValueOnInput("stick:3:vertical:up", 21846, "00|00|00|00|AA|AA|02|03");
          });

          it("should emit 'stick:3:vertical:zero' with position 0 if vertically released", function () {
            expectEventWithValueOnInput("stick:3:vertical:zero", 0, "00|00|00|00|00|00|02|03");
          });

          it("should emit 'stick:3:vertical:down' with position 2570 if pulled down", function () {
            expectEventWithValueOnInput("stick:3:vertical:down", 2570, "00|00|00|00|0A|0A|02|03");
          });

          it("should emit 'stick:3:horizontal:right' with position 2570 if pushed right", function () {
            expectEventWithValueOnInput("stick:3:horizontal:right", 2570, "00|00|00|00|0A|0A|02|02");
          });

          it("should emit 'stick:3:horizontal:zero' with position 0 if horizontally released", function () {
            expectEventWithValueOnInput("stick:3:horizontal:zero", 0, "00|00|00|00|00|00|02|02");
          });

          it("should emit 'stick:3:horizontal:left' with position 21846 if pushed left", function () {
            expectEventWithValueOnInput("stick:3:horizontal:left", 21846, "00|00|00|00|AA|AA|02|02");
          });
        });

        describe("Scaled Position", function () {
          beforeEach(function () {
            joystick.setMaximumAxesPosition(100);
          });

          it("should emit 'stick:3:vertical:up' with position 67 if pushed up", function () {
            expectEventWithValueOnInput("stick:3:vertical:up", 67, "00|00|00|00|AA|AA|02|03");
          });

          it("should emit 'stick:3:vertical:zero' with position 0 if vertically released", function () {
            expectEventWithValueOnInput("stick:3:vertical:zero", 0, "00|00|00|00|00|00|02|03");
          });

          it("should emit 'stick:3:vertical:down' with position 8 if pulled down", function () {
            expectEventWithValueOnInput("stick:3:vertical:down", 8, "00|00|00|00|0A|0A|02|03");
          });

          it("should emit 'stick:3:horizontal:right' with position 8 if pushed right", function () {
            expectEventWithValueOnInput("stick:3:horizontal:right", 8, "00|00|00|00|0A|0A|02|02");
          });

          it("should emit 'stick:3:horizontal:zero' with position 0 if horizontally released", function () {
            expectEventWithValueOnInput("stick:3:horizontal:zero", 0, "00|00|00|00|00|00|02|02");
          });

          it("should emit 'stick:3:horizontal:left' with position 67 if pushed left", function () {
            expectEventWithValueOnInput("stick:3:horizontal:left", 67, "00|00|00|00|AA|AA|02|02");
          });
        });
      });
    });
  });
});
