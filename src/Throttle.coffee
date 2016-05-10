
{ Any } = require "type-utils"

Type = require "Type"

type = Type "Throttle"

type.inherits Function

type.createInstance ->
  self = -> self._callEventually self._context or this, arguments

type.optionTypes =
  ms: Number
  fn: Function.Kind
  context: Any
  runEventually: Boolean

type.optionDefaults =
  runEventually: yes

type.defineValues

  _ms: (options) -> options.ms

  _fn: (options) -> options.fn

  _context: (options) -> options.context

  _runEventually: (options) -> options.runEventually

  _pending: null

  _disabled: no

  _throttle: null

type.bindMethods [ "_onThrottleEnd" ]

type.defineMethods

  toString: ->
    @_callEventually.toString()

  call: ->
    return if @_disabled
    @_stop()
    @_callImmediately @_context or this, arguments
    return

  disable: ->
    return if @_disabled
    @_disabled = yes
    @_stop()
    @_context = null
    return

  _callEventually: (context, args) ->
    return if @_disabled
    if @_throttle? then @_setPending context, args
    else @_callImmediately context, args

  _setPending: (context, args) ->
    return unless @_runEventually
    @_pending = { context, args }

  _onThrottleEnd: ->
    @_throttle = null
    return unless @_pending
    { context, args } = @_pending
    @_pending = null
    @_callImmediately context, args

  _callImmediately: (context, args) ->
    @_fn.apply context, args
    @_throttle = setTimeout @_onThrottleEnd, @_ms

  _stop: ->
    clearTimeout @_throttle
    @_throttle = null
    @_pending = null

module.exports = type.build()
