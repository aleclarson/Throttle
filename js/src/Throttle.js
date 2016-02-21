var Any, Factory;

require("lotus-require");

Any = require("type-utils").Any;

Factory = require("factory");

module.exports = Factory("Throttle", {
  kind: Function,
  create: function() {
    var self;
    return self = function() {
      return self._callEventually(self._bind || this, arguments);
    };
  },
  optionTypes: {
    ms: Number,
    fn: Function.Kind,
    bind: Any
  },
  initValues: function(options) {
    return {
      _ms: options.ms,
      _fn: options.fn,
      _bind: options.bind,
      _throttle: null,
      _pending: null,
      _disabled: false,
      _afterThrottle: (function(_this) {
        return function() {
          var args, bind, ref;
          _this._throttle = null;
          if (_this._pending == null) {
            return;
          }
          ref = _this._pending, bind = ref.bind, args = ref.args;
          _this._pending = null;
          return _this._callImmediately(bind, args);
        };
      })(this)
    };
  },
  toString: function() {
    return this._callEventually.toString();
  },
  call: function() {
    if (this._disabled) {
      return;
    }
    this._stop();
    this._callImmediately(this._bind || this, arguments);
  },
  disable: function() {
    if (this._disabled) {
      return;
    }
    this._disabled = true;
    this._stop();
    this._bind = null;
  },
  _callImmediately: function(bind, args) {
    this._fn.apply(bind, args);
    return this._throttle = setTimeout(this._afterThrottle, this._ms);
  },
  _callEventually: function(bind, args) {
    if (this._disabled) {
      return;
    }
    if (this._throttle != null) {
      this._pending = {
        bind: bind,
        args: args
      };
    } else {
      this._callImmediately(bind, args);
    }
  },
  _stop: function() {
    clearTimeout(this._throttle);
    this._throttle = null;
    return this._pending = null;
  }
});

//# sourceMappingURL=../../map/src/Throttle.map
