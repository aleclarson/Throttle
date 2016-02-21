
require "lotus-require"

{ Any } = require "type-utils"

Factory = require "factory"

module.exports = Factory "Throttle",

  kind: Function

  create: ->
    return self = ->
      self._callEventually self._bind or this, arguments

  optionTypes:
    ms: Number
    fn: Function.Kind
    bind: Any

  initValues: (options) ->
    _ms: options.ms
    _fn: options.fn
    _bind: options.bind
    _throttle: null
    _pending: null
    _disabled: no
    _afterThrottle: =>
      @_throttle = null
      return unless @_pending?
      { bind, args } = @_pending
      @_pending = null
      @_callImmediately bind, args

  toString: ->
    @_callEventually.toString()

  call: ->
    return if @_disabled
    @_stop()
    @_callImmediately @_bind or this, arguments
    return

  disable: ->
    return if @_disabled
    @_disabled = yes
    @_stop()
    @_bind = null
    return

  _callImmediately: (bind, args) ->
    @_fn.apply bind, args
    @_throttle = setTimeout @_afterThrottle, @_ms

  _callEventually: (bind, args) ->
    return if @_disabled
    if @_throttle? then @_pending = { bind, args }
    else @_callImmediately bind, args
    return

  _stop: ->
    clearTimeout @_throttle
    @_throttle = null
    @_pending = null
