var Any, Type, type;

Type = require("Type");

Any = require("Any");

type = Type("Throttle");

type.inherits(Function);

type.createInstance(function() {
  var self;
  return self = function() {
    return self._callEventually(self._context || this, arguments);
  };
});

type.optionTypes = {
  ms: Number,
  fn: Function.Kind,
  context: Any,
  runEventually: Boolean
};

type.optionDefaults = {
  runEventually: true
};

type.defineValues({
  _ms: function(options) {
    return options.ms;
  },
  _fn: function(options) {
    return options.fn;
  },
  _context: function(options) {
    return options.context;
  },
  _runEventually: function(options) {
    return options.runEventually;
  },
  _pending: null,
  _disabled: false,
  _throttle: null
});

type.bindMethods(["_onThrottleEnd"]);

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

module.exports = type.build();

//# sourceMappingURL=../../map/src/Throttle.map
