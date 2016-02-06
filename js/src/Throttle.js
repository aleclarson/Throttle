var Any, Factory;

require("lotus-require");

Any = require("type-utils").Any;

Factory = require("factory");

module.exports = Factory("Throttle", {
  kind: Function,
  func: function() {
    if (this._disabled) {
      return;
    }
    if (this._throttle != null) {
      this._pending = arguments;
    } else {
      this._start(arguments);
    }
  },
  optionTypes: {
    call: Function.Kind,
    bind: Any,
    limit: Number
  },
  initValues: function(options) {
    return {
      _call: options.call,
      _bind: options.bind,
      _limit: options.limit,
      _throttle: null,
      _pending: null,
      _disabled: false,
      _update: (function(_this) {
        return function() {
          var args;
          if (_this._pending == null) {
            return;
          }
          args = _this._pending;
          _this._throttle = null;
          _this._pending = null;
          return _this._start(args);
        };
      })(this)
    };
  },
  call: function() {
    if (this._disabled) {
      return;
    }
    this._stop();
    this._start(arguments);
  },
  disable: function() {
    if (this._disabled) {
      return;
    }
    this._disabled = true;
    this._stop();
    this._bind = null;
  },
  _start: function(args) {
    this._call.apply(this._bind, args);
    return this._throttle = setTimeout(this._update, this._limit);
  },
  _stop: function() {
    clearTimeout(this._throttle);
    this._throttle = null;
    return this._pending = null;
  }
});

//# sourceMappingURL=../../map/src/Throttle.map
