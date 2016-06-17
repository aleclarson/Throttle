var Type, getArgProp, isNumber, type;

getArgProp = require("getArgProp");

isNumber = require("isNumber");

Type = require("Type");

type = Type("Throttle");

type.inherits(Function);

type.createInstance(function() {
  var self;
  return self = function() {
    return self._callEventually(this, arguments);
  };
});

type.optionTypes = {
  ms: Number,
  fn: Function.Kind,
  runEventually: Boolean
};

type.optionDefaults = {
  runEventually: true
};

type.createArguments(function(args) {
  if (isNumber(args[0])) {
    args[0] = {
      ms: args[0],
      fn: args[1]
    };
  }
  return args;
});

type.defineValues({
  _ms: getArgProp("ms"),
  _fn: getArgProp("fn"),
  _context: getArgProp("context"),
  _runEventually: getArgProp("runEventually"),
  _pending: null,
  _disabled: false,
  _throttle: null
});

type.defineMethods({
  toString: function() {
    return this._callEventually.toString();
  },
  call: function() {
    if (this._disabled) {
      return;
    }
    this._stop();
    this._callImmediately(this._context || this, arguments);
  },
  disable: function() {
    if (this._disabled) {
      return;
    }
    this._disabled = true;
    this._stop();
    this._context = null;
  },
  _callEventually: function(context, args) {
    if (this._disabled) {
      return;
    }
    if (this._throttle != null) {
      return this._setPending(context, args);
    } else {
      return this._callImmediately(context, args);
    }
  },
  _setPending: function(context, args) {
    if (!this._runEventually) {
      return;
    }
    return this._pending = {
      context: context,
      args: args
    };
  },
  _onThrottleEnd: function() {
    var args, context, ref;
    this._throttle = null;
    if (!this._pending) {
      return;
    }
    ref = this._pending, context = ref.context, args = ref.args;
    this._pending = null;
    return this._callImmediately(context, args);
  },
  _callImmediately: function(context, args) {
    this._fn.apply(context, args);
    return this._throttle = setTimeout(this._onThrottleEnd, this._ms);
  },
  _stop: function() {
    clearTimeout(this._throttle);
    this._throttle = null;
    return this._pending = null;
  }
});

type.bindMethods(["_onThrottleEnd"]);

module.exports = type.build();

//# sourceMappingURL=../../map/src/Throttle.map
